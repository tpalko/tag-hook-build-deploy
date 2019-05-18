FROM node:latest
RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get -y install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add - 
RUN add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/debian \
   $(lsb_release -cs) \
   stable"
RUN apt-get -y update
RUN apt-get -y install docker-ce docker-ce-cli containerd.io
WORKDIR /app
COPY package.json /app
RUN yarn
COPY . /app
ENTRYPOINT ["npm", "start"]
