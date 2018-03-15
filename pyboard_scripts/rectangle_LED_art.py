import lcd160cr
import pyb
from random import randint
from adafruit_gps import GPS


pyb.LED(4).on()
pyb.delay(200)
pyb.LED(4).off()



class ArtShow(object):

    def __init__(self):
        self.lcd = lcd160cr.LCD160CR("X")
        self.accel = pyb.Accel()
        self.gps = GPS(datafile='/sd/gps.log')

    def LED_on(self,num=1):
        pyb.LED(num).on()

    def LED_off(self, num=1):
        pyb.LED(num).off()

    def LED_toggle(self, num=1):
        pyb.LED(num).toggle()

    def cycle_LED(self, speed=75):
        for i in range(1, 5):
            pyb.LED(i).on()
            pyb.delay(speed)
        for i in range(1, 5):
            pyb.LED(i).off()
            pyb.delay(speed)

    def toggles_LEDS(self, speed=200):
       for i in range(1,5):
          pyb.LED(i).on()
          pyb.delay(speed)
          pyb.LED(i).off()

    def blink_LED(self, num=4, speed=75):
        pyb.LED(num).off()
        pyb.delay(speed)
        pyb.LED(num).on()
        pyb.delay(speed)
        pyb.LED(num).off()

    def start(self):
        while not self.lcd.is_touched():
            fg = self.lcd.rgb(randint(128, 255), randint(128, 255), randint(128, 255))
            bg = self.lcd.rgb(randint(0, 128), randint(0, 128), randint(0, 128))
            self.lcd.set_pen(fg, bg)
            self.lcd.rect(randint(0, self.lcd.w), randint(0, self.lcd.h), randint(10, 40), randint(10, 40))
            cur_led = randint(1,4)
            pyb.LED(cur_led).on()
            pyb.delay(200)
            pyb.LED(cur_led).off()

        for i in range(1,5):
            pyb.LED(i).off()
        fg = self.lcd.rgb(255, 0, 0)
        bg = self.lcd.rgb(0, 0, 0)

        self.lcd.set_text_color(fg, bg)
        self.lcd.set_pos(5, 5)
        self.lcd.set_font(1)
        self.lcd.write("What a great show")
        pyb.delay(1000)
        fg = self.lcd.rgb(0, 255, 0)
        self.lcd.set_text_color(fg, bg)
        self.lcd.set_pos(5, 5)
        self.lcd.write("What a great show")
        pyb.delay(1000)
        fg = self.lcd.rgb(0, 255, 255)
        self.lcd.set_text_color(fg, bg)
        self.lcd.set_pos(5, 5)
        self.lcd.write("What a great show")
        pyb.delay(1000)
        self.lcd.set_pen(bg, bg)
        self.silly_write("What a great show", 180)
        self.lcd.erase()
        self.cycle_LED()

    def write(self, message=None, clear=False):

        if message is None:
            message = "Good news everyone!"
        fg = self.lcd.rgb(255, 255, 0)
        bg = self.lcd.rgb(0, 0, 0)
        self.lcd.set_text_color(fg, bg)
        self.lcd.set_pos(5, 5)
        self.lcd.set_font(1)
        if clear:
            self.clear()
        self.lcd.write(message)

    def silly_write(self, message=None, speed=300):
        if message is None:
            message = "Good news everyone!"
        fg = self.lcd.rgb(255, 255, 0)
        bg = self.lcd.rgb(0, 0, 0)
        self.lcd.set_text_color(fg, bg)
        self.lcd.set_pos(5, 5)
        self.lcd.set_font(1)

        ctr=0
        for char in message:
            if ctr == 21:
                self.lcd.write("\n")
                ctr = -1
            self.lcd.write(char)
            ctr += 1
            if char != " ":
                pyb.delay(speed)

        self.lcd.set_pos(5, 5)
        ctr=0
        for char in message:
            if ctr == 21:
                self.lcd.write("\n")
                ctr = -1
            self.lcd.write(" ")
            ctr += 1

            if char != " ":
                pyb.delay(max(speed-100,1))

    def clear(self):
        self.lcd.set_pen(self.lcd.rgb(0, 0, 0), self.lcd.rgb(0, 0, 0))
        self.lcd.erase()

    def touching_dislay(self, sensitivity=30):
        fg = self.lcd.rgb(255, 255, 0)
        bg = self.lcd.rgb(0, 0, 0)
        self.lcd.set_text_color(fg, bg)

        while not self.shake_it_off(sensitivity):
            if self.lcd.is_touched():
                self.lcd.set_pos(5, 5)
                self.lcd.set_font(1)
                pos = self.lcd.get_touch()
                self.lcd.write(str(pos))
                pyb.delay(15)
            else:
                self.lcd.erase()
        self.lcd.erase()
        fg = self.lcd.rgb(255, 0, 0)
        bg = self.lcd.rgb(0, 0, 0)

        self.lcd.set_text_color(fg, bg)
        self.lcd.set_pos(5, 5)
        self.lcd.set_font(1)
        self.lcd.write("What a touching\n\r display")
        pyb.delay(1000)
        fg = self.lcd.rgb(0, 255, 0)
        self.lcd.set_text_color(fg, bg)
        self.lcd.set_pos(5, 5)
        self.lcd.write("What a touching\n\r display")
        pyb.delay(1000)
        fg = self.lcd.rgb(0, 255, 255)
        self.lcd.set_text_color(fg, bg)
        self.lcd.set_pos(5, 5)
        self.lcd.write("What a touching\n\r display")
        pyb.delay(1000)
        self.lcd.set_pen(bg, bg)
        self.lcd.erase()
        self.cycle_LED()
        self.blink_LED()

    def square_dance(self, sensitivity=30):
        pos = None
        end_pos = None
        while not self.shake_it_off(sensitivity):
            if self.lcd.is_touched():
                if pos is None:
                    pos = self.lcd.get_touch()
                end_pos = self.lcd.get_touch()

            else:
                if end_pos is not None and pos is not None:
                    fg = self.lcd.rgb(randint(128, 255), randint(128, 255), randint(128, 255))
                    bg = self.lcd.rgb(randint(0, 128), randint(0, 128), randint(0, 128))
                    self.lcd.set_pen(fg, bg)
                    self.lcd.rect(min(pos[1], end_pos[1]), min(pos[2],end_pos[2]),abs(end_pos[1]-pos[1]), abs(end_pos[2] - pos[2]))
                    pos = None
                    end_pos = None
                pyb.delay(15)

        self.silly_write("See you later square\r cowboy", 150)
        self.lcd.erase()
        self.cycle_LED()

    def shake_it_off(self, sensitivity=25):
        if max(abs(self.accel.x()), abs(self.accel.y()), abs(self.accel.z())) > sensitivity:
            return True
        else:
            return False

    def sketch(self, sensitivity=30, loop=False):
        while True:
            fg = self.lcd.rgb(randint(128, 255), randint(128, 255), randint(128, 255))
            bg = self.lcd.rgb(randint(0, 128), randint(0, 128), randint(0, 128))
            self.lcd.set_pen(fg, bg)
            if self.lcd.is_touched():
                pos = self.lcd.get_touch()
                self.lcd.dot(pos[1], pos[2])
            if self.shake_it_off(sensitivity):
                self.clear()
                self.cycle_LED()
                if loop:
                    self.blink_LED()
                else:
                    break

    def print_gps(self, sensitivity=30):
        fg = self.lcd.rgb(255, 255, 0)
        while not self.shake_it_off(sensitivity):
            self.gps.update()
            self.write(message=self.gps.position(), clear=True)
            pyb.delay(1000)
            self.blink_LED()
        self.clear()
        self.toggles_LEDS()

    def run_callback(self, callback_func, clear_screen=False, *args,**kwargs):
        self.clear()
        fg = self.lcd.rgb(randint(128, 255), randint(128, 255), randint(128, 255))
        bg = self.lcd.rgb(randint(0, 128), randint(0, 128), randint(0, 128))
        self.lcd.set_pen(fg, bg)
        self.lcd.rect(10,10, self.lcd.w-20, self.lcd.h-20)
        self.lcd.set_orient(lcd160cr.LANDSCAPE)
        self.lcd.set_pos(25, 35)
        fg = self.lcd.rgb(255, 255, 0)
        self.lcd.set_text_color(fg, bg)
        self.lcd.set_font(0,5)
        self.lcd.write("Start")
        self.lcd.set_orient(lcd160cr.PORTRAIT)
        while not self.lcd.is_touched():
            pass
        while self.lcd.is_touched():
            pass
        if clear_screen:
            self.clear()
        callback_func(*args,**kwargs)
        self.clear()