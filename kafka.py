import json
from pykafka import KafkaClient

client = KafkaClient(hosts='127.0.0.1:9092')

topic = client.topics[b'demostream']

def stream_out(sent_data):
    data = sent_data
    with topic.get_producer() as producer:
        producer.produce(data)
