FROM node:14
WORKDIR /Users/guymanor/WebstormProjects/covid19webserver
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "node", "app.js" ]
