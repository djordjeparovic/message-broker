FROM node:9-alpine

WORKDIR /home/node/app

COPY ./package* ./
RUN npm install && \
    npm cache clean --force

COPY . .

EXPOSE 8080

CMD ["npm", "run", "serve-production"]
