FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Install pm2 so we can run our application
RUN npm install -g pm2

# Bundle app source
COPY . /usr/src/app

EXPOSE 2020
CMD [ "pm2-docker", "process.yml", "--only", "APP" ]