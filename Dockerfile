# Используем базовый образ с Node.js и Alpine
FROM node:16-alpine

# Установка ffmpeg для работы с видео и аудио
RUN apk update && apk add ffmpeg

# Устанавливаем рабочую директорию в контейнере
WORKDIR /usr/src/app

# Копирование файлов `package.json` и `package-lock.json` (если есть)
COPY package*.json ./

# Установка всех зависимостей
RUN npm install --production

# Копирование остальных файлов проекта в рабочую директорию
COPY . .

# Открытие порта 3000 для внешнего мира
EXPOSE 3000

# Команда для запуска приложения
CMD ["node", "server.js"]
