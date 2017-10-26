import json
from pykafka import KafkaClient

client = KafkaClient(hosts='127.0.0.1:9092') #NOTE: Connection to broker

topic = client.topics[b'demostream'] #NOTE: Topic selection (byte-str)

# function to collect byte data and stream out
def stream_out(sent_data):
    data = sent_data
    with topic.get_producer() as producer: #asynchronous producer
        producer.produce(data)
