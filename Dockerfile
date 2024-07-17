# Stage 1: Build the Angular application
FROM node:18.17.0 as builder

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем файлы package.json и package-lock.json для установки зависимостей
COPY frontend/shop/package*.json ./

RUN npm install || npm install
COPY frontend/shop/ ./
RUN npm run build 


FROM nginx:alpine
COPY ../../nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/shop/browser /usr/share/nginx/html
