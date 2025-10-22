# Multi-stage build for React + Vite frontend

# Build stage
FROM node:18-alpine as build

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# 환경 변수 설정 (빌드 시 사용)
ARG VITE_API_BASE_URL=http://localhost:8080
ARG VITE_GOOGLE_MAPS_API_KEY=
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY

# 애플리케이션 빌드
RUN npm run build

# Production stage
FROM nginx:alpine

# 빌드된 파일을 nginx에 복사 (Vite는 dist 폴더에 빌드)
COPY --from=build /app/dist /usr/share/nginx/html

# nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf

# 포트 노출
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# nginx 시작
CMD ["nginx", "-g", "daemon off;"]

