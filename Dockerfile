FROM ubuntu:16.04

MAINTAINER Adrian Agnic "adrian@tura.io"
MAINTAINER Charles Emrich "charles@tura.io"

RUN apt-get update -y && \
    apt-get install -y python3-pip python-dev && apt-get clean autoclean && \
    rm -rf /var/lib/apt/lists/*

COPY ./Requirements.txt /app/Requirements.txt

WORKDIR /app

RUN pip3 install -r Requirements.txt

COPY . /app

ENTRYPOINT ["python3"]

CMD ["demo.py"]
