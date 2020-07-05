FROM node:12.18.2-buster

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
# optionally if you want to run npm global bin without specifying path
ENV PATH=$PATH:/home/node/.npm-global/bin 

RUN npm config set unsafe-perm true

RUN npm -g install truffle@5.1.13 --unsafe-perm

# Create app directory
WORKDIR /usr/src/app

RUN mkdir -p ./ui
RUN mkdir -p ./build

RUN chown -R node ./build
RUN chown -R node ./build

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY ui/package*.json ./ui/

RUN npm ci --unsafe-perm

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080

USER node
CMD [ "sh", "setup.sh" ]
