FROM docker.io/node:17 as build-deps
WORKDIR /app

COPY package.json /app/
RUN npm i -f

COPY . /app
RUN npm run build

FROM docker.io/galenguyer/nginx:1.21.6-alpine3.15.0-spa
COPY --from=build-deps /app/dist /usr/share/nginx/html/static

