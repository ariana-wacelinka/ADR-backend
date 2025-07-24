FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache bash

COPY package*.json ./
RUN npm ci --production

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
