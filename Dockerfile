FROM gliderlabs/alpine:3.4

MAINTAINER Adrian Agnic "adrian@tura.io"

RUN apk add --no-cache python3 && \
  python3 -m ensurepip && \
  rm -r /usr/lib/python*/ensurepip && \
  pip3 install --upgrade pip setuptools && \
  if [ ! -e /usr/bin/pip ]; then ln -s pip3 /usr/bin/pip ; fi && \
  rm -r /root/.cache

RUN apk add --no-cache python3-dev
RUN apk add --no-cache alpine-sdk

COPY ./Requirements.txt /app/Requirements.txt

WORKDIR /app

RUN pip3 install -r Requirements.txt

COPY . /app

EXPOSE 80

ENTRYPOINT ["python3"]

CMD ["demo.py"]
