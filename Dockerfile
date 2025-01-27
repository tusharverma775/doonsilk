#Import nodejs image
FROM node:16

WORKDIR /app

RUN mkdir ./public

RUN mkdir ./public/image

RUN mkdir ./public/pdf
 
COPY package*.json ./

#RUN npm remove -g pm2

RUN npm install

#RUN npm install -g @socket.io/pm2
RUN npm install -g pm2

COPY . .

EXPOSE 7467

# #CMD [ "pm2", "start", "app.js", "-i", "max"]
# CMD ["pm2", "kill"]

# CMD ["rm", "-rf", "~/.pm2"]

CMD [ "pm2-runtime", "start", "index.js", "-i", "1"]
