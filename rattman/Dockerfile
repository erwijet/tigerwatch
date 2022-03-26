FROM docker.io/node:17 AS build-deps

WORKDIR /app
COPY package.json /app/package.json

RUN npm install --force
COPY . /app

RUN npm run build

FROM docker.io/galenguyer/nginx:1.21.6-alpine3.15.0-spa
COPY --from=build-deps /app/dist /usr/share/nginx/html
