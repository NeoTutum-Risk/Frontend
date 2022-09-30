# FROM node:14

# WORKDIR /app 

# COPY package*.json /

# RUN npm ci

# RUN npm run build

# RUN npm install -g serve

# COPY build /app

# ENV REACT_APP_BACKEND_URI=https://stage-service-dot-neotutum.nw.r.appspot.com
# ENV PORT=5000  docker run -it -p 9000:8080 frontend-docker

# CMD ["serve","-s","build","-l",PORT]

# build env
FROM node:14 as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
# ARG REACT_APP_BACKEND_URI
# ENV REACT_APP_BACKEND_URI=$REACT_APP_BACKEND_URI
COPY . ./
RUN npm run build

# production env
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/.env.example /usr/share/nginx/html/.env
COPY --from=build /app/nginx/default.conf /etc/nginx/conf.d/default.conf
RUN apk add --update nodejs
RUN apk add --update npm
RUN npm i -g runtime-env-cra@0.2.0

WORKDIR /usr/share/nginx/html
EXPOSE 80
CMD ["/bin/sh", "-c", "runtime-env-cra && nginx -g \"daemon off;\""]
#  docker build --build-arg BACKEND_URI=${http://localhost:5000} -t frontend-neotutum-aws .