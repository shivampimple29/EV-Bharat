FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install rasa==3.6.21 rasa-sdk==3.6.2

COPY . .
RUN rasa train

RUN chmod +x start.sh

EXPOSE 7860
CMD ["./start.sh"]