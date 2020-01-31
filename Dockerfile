FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories
RUN apk --no-cache add --update nodejs yarn autoconf automake gcc g++ lcms2-dev libpng-dev pngquant
CMD npm install && npm run build && nginx -g "daemon off;"
