FROM nginx:alpine
RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories
RUN apk --no-cache add --update nodejs npm
CMD npm install && npm run build && nginx -g "daemon off;"
