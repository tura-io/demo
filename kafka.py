import json
from pykafka import KafkaClient
import pykafka.utils.compression as Compression

__version__ = '0.0.1'
__author__ = 'Adrian Agnic <adrian@tura.io>'

class Producer():
    """
    Simple kafka producer to stream out generated json data
    Connection properties hardcoded
    """
    def __init__(self):
        self.client = KafkaClient(hosts='127.0.0.1:9092') #NOTE: Connection to broker
        self.topic = self.client.topics[b'testdemo'] #NOTE: Topic selection (byte-str)
        self.producer = self.topic.get_producer(delivery_reports=False)
        self.count = 0

    def stream_out(self, data):
        """
        Function that compresses source data, sets a partition key then streams out
        """
        cdata = Compression.encode_snappy(data, xerial_compatible=True, xerial_blocksize=32768)
        bcount = str(self.count).encode()
        self.count += 1
        self.producer.produce(cdata, partition_key=bcount)
        # if count % 5 ** 2 == 0:
        #     while True:
        #         try:
        #             msg, exc = producer.get_delivery_report(block=False)
        #             if exc is not None:
        #                 print('Delivery Failure for {}: {}'.format(msg.partition_key, repr(exc)))
        #             else:
        #                 print('Success: {}'.format(msg.partition_key))
        #         except ValueError:
        #             print('value')
        #         except TypeError:
        #             print('type')
        #         except NameError:
        #             print('name')
        #         except Queue.Empty:
        #             print('empty queue')
