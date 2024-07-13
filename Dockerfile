# Stage 1: Build the Angular application
FROM node:18.17.0 as builder

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем файлы package.json и package-lock.json для установки зависимостей
COPY package*.json ./

RUN npm ci
RUN npm install -g @angular/cli
COPY . . 
RUN npm run build


FROM nginx:latest
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/shop/browser /usr/share/nginx/html
EXPOSE 4200
