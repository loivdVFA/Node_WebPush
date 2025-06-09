FROM node:22.14.0-alpine as build-stage
WORKDIR /app
COPY package*.json ./
COPY package-lock.json ./
RUN yarn install
COPY . .
EXPOSE 3000
CMD ["node", "main.js"]