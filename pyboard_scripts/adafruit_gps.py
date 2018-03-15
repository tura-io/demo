"""
`adafruit_gps`
====================================================

GPS parsing module.  Can parse simple NMEA data sentences from serial GPS
modules to read latitude, longitude, and more.

* Author(s): Parham Parvizi

Implementation Notes
--------------------

**Hardware:**

* Adafruit `Ultimate GPS Breakout <https://www.adafruit.com/product/746>`_
* MicroPython board `MicroPython <http://micropython.org/>`
"""
from pyb import UART
from pyb import delay
from time import ticks_ms
import io
import sys


__version__ = "0.0.0-auto.0"


# Internal helper parsing functions.
# These handle input that might be none or null and return none instead of
# throwing errors.


def _parse_degrees(nmea_data):
    # Parse a NMEA lat/long data pair 'dddmm.mmmm' into a pure degrees value.
    # Where ddd is the degrees, mm.mmmm is the minutes.
    if nmea_data is None or len(nmea_data) < 3:
        return None
    raw = float(nmea_data)
    deg = raw // 100
    minutes = raw % 100
    return deg + minutes/60


def _parse_int(nmea_data):
    if nmea_data is None or nmea_data == '':
        return None
    return int(nmea_data)


def _parse_float(nmea_data):
    if nmea_data is None or nmea_data == '':
        return None
    return float(nmea_data)


class GPS:
    """GPS parsing module.  Can parse simple NMEA data sentences from serial GPS
    modules to read latitude, longitude, and more.
    """
    def __init__(self, uart=None, datafile=None, debug=False):
        # Initialize starting values for GPS attributes.
        self.timestamp_utc = None
        self.date_utc = '2000-01-01'  # default to 2000-01-01
        self.time_utc = '00:00:00.000'  # default to mid-night
        self.latitude = None
        self.longitude = None
        self.fix_quality = None
        self.satellites = None
        self.horizontal_dilution = None
        self.altitude_m = None
        self.height_geoid = None
        self.velocity_knots = None
        self.speed_knots = None
        self.track_angle_deg = None
        # counters
        self._points = 0
        self._gpgga = 0
        self._gprmc = 0
        # file handle
        self._datafile = None
        self._file = None
        if datafile is not None:
            self._datafile = datafile
            self._file = io.open(datafile, 'a')
        # Initializing UART and setting Adafruit GPS parameters
        if uart is not None:
            self._uart = uart
        else:
            self._uart = UART(3, 9600)
        self._init_gps()
        # misc
        self.debug = debug

    def _init_gps(self):
        """
        Initialize Adafruit GPS chip.
         - Issue a full cold restart to reset the chip
         - Set baudrate to 115200
         - Turn on only GPGGA & GPRMC messages
        :return:
        """
        # # issue a full cold restart to reset the chip
        self.send_command('PMTK104')
        # # reset the baudrate high
        # self.send_command('PMTK251,57600')
        # # self._uart = UART(1, 57600)
        line = str(self._uart.readline(), 'utf-8').strip()
        print(line)
        # turn on only GPGGA and GPRMC output
        self.send_command('PMTK314,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0')
        line = str(self._uart.readline(), 'utf-8').strip()
        print(line)
        self.send_command("PMTK220,%d" % 1000)
        line = str(self._uart.readline(), 'utf-8').strip()
        print(line)
        # for i in range(1, 20):
        #     line = str(self._uart.readline(), 'utf-8').strip()
        #     print(line)

    def close(self):
        self._uart.deinit()
        if self._file is not None:
            self._file.flush()
            self._file.close()

    def update(self):
        """Check for updated data from the GPS module and process it
        accordingly.  Returns True if new data was processed, and False if
        nothing new was received.
        """
        # Grab a sentence and check its data type to call the appropriate
        # parsing function.
        self._pull()
        return True

    def send_command(self, command, add_checksum=True):
        """Send a command string to the GPS.  If add_checksum is True (the
        default) a NMEA checksum will automatically be computed and added.
        Note you should NOT add the leading $ and trailing * to the command
        as they will automatically be added!
        """
        self._uart.write('$')
        self._uart.write(command)
        if add_checksum:
            checksum = 0
            for char in command:
                checksum ^= ord(char)
            self._uart.write('*')
            self._uart.write('{:02x}'.format(checksum).upper())
        self._uart.write('\r\n')

    @property
    def has_fix(self):
        """True if a current fix for location information is available."""
        return self.fix_quality is not None and self.fix_quality >= 1

    def _pull(self):
        """
        pull data from adafruit uart and parse it into sentences
        :return:
        """
        try:
            line = self._uart.readline()
            # ignore if empty line
            if line is None or line == b'' or len(line) < 1:
                return None
            # split if multiple sentences in one line
            line = str(line, 'utf-8').strip().split('$')
            for sentence in line:
                if sentence is None or sentence == '':
                    continue
                # remove the checksum field
                sentence = sentence[:-3] if sentence[-3] == '*' else sentence

                # Parse out the type of sentence (first string after $ up to comma)
                # and then grab the rest as data within the sentence.
                delineator = sentence.find(',')
                if delineator == -1:
                    continue
                data_type = sentence[:delineator]
                self._parse_sentence(data_type, sentence[delineator + 1:])
        except Exception as x:
            if self.debug:
                sys.print_exception(x)
        # print location
        if self.debug:
            print(self.position())
        if self.has_fix:
            self._save_gps()

    def _parse_sentence(self, data_type, sentence):
        data_type = data_type.upper()
        # print(data_type, sentence)
        if data_type == 'GPGGA':      # GGA, 3d location fix
            return self._parse_gpgga(sentence)
        elif data_type == 'GPRMC':    # RMC, minimum location info
            return self._parse_gprmc(sentence)

    def _update_timestamp(self, date_utc, time_utc):
        """
        update object's timestamp based on parsed time from NMEA data
        :param date_utc: UTC date in yymmdd format
        :param time_utc: UTC time in HHMMSS format
        :return:
        """
        self.date_utc = date_utc if date_utc is not None else self.date_utc
        self.time_utc = time_utc if time_utc is not None else self.time_utc
        self.timestamp_utc = "%s %s" % (date_utc, time_utc)

    def position(self):
        return "%s,%f,%f,%d,%d,%.2f,%.2f,%.2f,%.2f,%.2f,%f" % \
               (self.timestamp_utc if self.timestamp_utc is not None else "",
                self.latitude if self.latitude is not None else 0,
                self.longitude if self.longitude is not None else 0,
                self.fix_quality if self.fix_quality is not None else 0,
                self.satellites if self.satellites is not None else 0,
                self.horizontal_dilution if self.horizontal_dilution is not None else 0,
                self.altitude_m if self.altitude_m is not None else 0,
                self.height_geoid if self.height_geoid is not None else 0,
                self.velocity_knots if self.velocity_knots is not None else 0,
                self.speed_knots if self.speed_knots is not None else 0,
                self.track_angle_deg if self.track_angle_deg is not None else 0)

    def _save_gps(self):
        """
        Write current GPS information to the datafile
        :return:
        """
        if self._file is not None:
            self._file.write(self.position() + "\n")

    def _parse_gpgga(self, args):
        # Parse the arguments (everything after data type) for NMEA GPGGA
        # 3D location fix sentence.
        data = args.split(',')
        if data is None or len(data) != 14:
            # print('GPGGA bad # of fields')
            return False    # Unexpected number of params.

        # if it doesn't have fix then ignore the sentence
        fix = _parse_int(data[5])
        if fix == 0:
            return False

        # Parse fix time.
        time_utc = int(_parse_float(data[0]))
        if time_utc is not None:
            hours = time_utc // 10000
            mins = (time_utc // 100) % 100
            secs = time_utc % 100
            time_utc = "%02d:%02d:%02d.%03d" % (hours, mins, secs, ticks_ms() % 1000)
            self._update_timestamp(self.date_utc, time_utc)

        # Parse latitude and longitude.
        self.latitude = _parse_degrees(data[1])
        if self.latitude is not None and data[2] is not None and data[2].lower() == 's':
            self.latitude *= -1.0
        self.longitude = _parse_degrees(data[3])
        if self.longitude is not None and data[4] is not None and data[4].lower() == 'w':
            self.longitude *= -1.0
        # Parse out fix quality and other simple numeric values.
        self.fix_quality = _parse_int(data[5])
        self.satellites = _parse_int(data[6])
        self.horizontal_dilution = _parse_float(data[7])
        self.altitude_m = _parse_float(data[8])
        self.height_geoid = _parse_float(data[10])
        return True

    def _parse_gprmc(self, args):
        # Parse the arguments (everything after data type) for NMEA GPRMC
        # minimum location fix sentence.
        data = args.split(',')
        if data is None or len(data) < 11:
            # print('GPRMC bad # of fields')
            return False    # Unexpected number of params.

        # check for valid NMEA position
        if data[1] is None or data[1] == 'V':
            return False    # invalid data

        # Parse tuc date and time.
        time_utc = int(_parse_float(data[0]))
        if time_utc is not None:
            hours = time_utc // 10000
            mins = (time_utc // 100) % 100
            secs = time_utc % 100
            time_utc = "%02d:%02d:%02d.%03d" % (hours, mins, secs, ticks_ms() % 1000)
        date_utc = '2000-01-01'
        if data[8] is not None and len(data[8]) == 6:
            day = int(data[8][0:2])
            month = int(data[8][2:4])
            year = 2000 + int(data[8][4:6])
            date_utc = "%04d-%02d-%02d" % (year, month, day)
        self._update_timestamp(date_utc, time_utc)

        # Parse status (active/fixed or void).
        status = data[1]
        self.fix_quality = 0
        if status is not None and status.lower() == 'a':
            self.fix_quality = 1
        # Parse latitude and longitude.
        self.latitude = _parse_degrees(data[2])
        if self.latitude is not None and \
           data[3] is not None and data[3].lower() == 's':
            self.latitude *= -1.0
        self.longitude = _parse_degrees(data[4])
        if self.longitude is not None and \
           data[5] is not None and data[5].lower() == 'w':
            self.longitude *= -1.0
        # Parse out speed and other simple numeric values.
        self.speed_knots = _parse_float(data[6])
        self.track_angle_deg = _parse_float(data[7])
        return True


def main():
    gps = GPS(datafile='/sd/gps.log', debug=True)
    for i in range(1, 16):
        gps.update()
        delay(1000)
    gps.close()


if __name__ == '__main__':
    main()
