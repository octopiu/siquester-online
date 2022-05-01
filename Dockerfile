FROM alpine:latest

RUN apk add nodejs npm

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

RUN chown -R 1000:1000 /app
USER 1000:1000