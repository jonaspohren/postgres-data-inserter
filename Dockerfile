FROM node:16.15.0-alpine
WORKDIR /var/app
COPY . .
RUN apk add yarn && yarn install
ENTRYPOINT ["yarn", "run", "start:insert"]
CMD ["1000"]