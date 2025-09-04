# Ané De Ridder - u23542676

FROM node:22-alpine

ENV PORT=8080

WORKDIR /u23542676

COPY . .

RUN npm install

CMD [ "npm", "start" ]

EXPOSE 8080