FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install python3-pip -y \
    && rm -rf /var/lib/apt/lists/* 

COPY . .

RUN pip install -r requirements.txt && \
    pip install -r app/requirements.txt && \
    pip install -r app/modules/requirements.txt

WORKDIR /app/app

CMD ["flask", "run"]
