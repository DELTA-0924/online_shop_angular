# Используем за основу образ Node.js
FROM node:14.17.3 as builder

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем файлы package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы проекта в рабочую директорию в контейнере
COPY . .

# Собираем приложение с опцией --prod
RUN npm run build --prod

# Используем Nginx для обслуживания собранного приложения
FROM nginx:latest

# Копируем статические файлы сборки Angular из предыдущего этапа в рабочую директорию Nginx
COPY --from=builder /app/dist/* /usr/share/nginx/html/

# Копируем SSL сертификаты для использования в Nginx
COPY ./ssl/frontend.crt /etc/nginx/ssl/frontend.crt
COPY ./ssl/frontend.key /etc/nginx/ssl/frontend.key

# Настраиваем конфигурацию Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80 для взаимодействия с приложением
EXPOSE 80

# Запускаем Nginx в режиме daemon
CMD ["nginx", "-g", "daemon off;"]
