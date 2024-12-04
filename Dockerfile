FROM node:22-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --network-timeout 1000000000

COPY . .

CMD [ "yarn", "webdev", "-p", "80" ]
