FROM node:14

WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./tsconfig.build.json ./
COPY ./tsconfig.json ./

COPY wait-for-it.sh /wait-for-it.sh

RUN chmod +x /wait-for-it.sh

RUN npm install


COPY . .

EXPOSE 3001


