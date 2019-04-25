FROM node:latest
RUN apt-get -y update && apt-get -y upgrade
WORKDIR /app
COPY package.json /app
RUN yarn
COPY . /app
ENTRYPOINT ["npm", "start"]
