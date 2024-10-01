FROM node:14.16.0

WORKDIR /

COPY package.json .

RUN npm install -g html-pdf

RUN npm install

RUN npm install @types/bson@4.0.3

COPY . .

RUN npm run build-ts

EXPOSE 1337

CMD [ "npm", "start" ]