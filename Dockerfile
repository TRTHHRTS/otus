FROM node:alpine

ENV NODE_ENV=production
ENV PORT=8000

WORKDIR /app
COPY ./simple_app .
RUN npm install --production

EXPOSE 8000

CMD [ "npm", "start" ]


