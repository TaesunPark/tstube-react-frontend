# 1단계: React 앱 빌드
FROM node:18 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
EXPOSE 3000
CMD ["npm", "start"]