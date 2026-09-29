FROM python:3.11-slim

WORKDIR /app

# MySQL接続用ライブラリに必要なパッケージをインストール
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# ライブラリのコピーとインストール
COPY requirements.txt .
RUN python -m pip install --no-cache-dir -r requirements.txt

# コードの変更を即時反映してWebサーバーを起動
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]