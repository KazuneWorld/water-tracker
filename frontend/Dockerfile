FROM node:20-slim

WORKDIR /app

# package.json をコピーしてライブラリをインストール
COPY package*.json ./
RUN npm install

CMD ["npm", "run", "dev"]