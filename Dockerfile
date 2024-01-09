# Stage 1: Build
FROM node:alpine AS build

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Production
FROM nginx:alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html

# Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
