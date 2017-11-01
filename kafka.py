import json
from pykafka import KafkaClient
import pykafka.utils.compression as Compression

client = KafkaClient(hosts='127.0.0.1:9092') #NOTE: Connection to broker

topic = client.topics[b'demo'] #NOTE: Topic selection (byte-str)

# function to collect byte data and stream out
def stream_out(data):
    with topic.get_producer(delivery_reports=True) as producer: #asynchronous producer
        count = 0
        cdata = Compression.encode_snappy(data, xerial_compatible=True, xerial_blocksize=32768)
        while True:
            count += 1
            bcount = str(count).encode()
            producer.produce(cdata, partition_key=bcount)
            if count % 5 ** 2 == 0:
                while True:
                    try:
                        msg, exc = producer.get_delivery_report(block=False)
                        if exc is not None:
                            print('Delivery Failure for {}: {}'.format(msg.partition_key, repr(exc)))
                        else:
                            print('Success: {}'.format(msg.partition_key))
                    except NameError, TypeError, ValueError:
                        print('name, type, or value error')
