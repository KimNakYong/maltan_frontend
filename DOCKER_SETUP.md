# 프론트엔드 Docker 설정 가이드

## 📦 **Docker로 프론트엔드 실행하기**

### **방법 1: Docker Compose 사용 (권장)**

#### **1단계: 환경 변수 설정**

`docker-compose.yml` 파일에서 환경 변수를 수정하세요:

```yaml
build:
  args:
    VITE_API_BASE_URL: http://localhost:8080  # 백엔드 API URL
    VITE_KAKAO_MAP_API_KEY: your_kakao_map_api_key  # 카카오맵 API 키
```

#### **2단계: Docker Compose로 실행**

```bash
# 프론트엔드 폴더로 이동
cd F:\3project\maltan-frontend

# Docker 이미지 빌드 및 컨테이너 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 중지
docker-compose down
```

#### **3단계: 브라우저에서 확인**

```
http://localhost:3000
```

---

### **방법 2: Docker 명령어 직접 사용**

#### **1단계: Docker 이미지 빌드**

```bash
cd F:\3project\maltan-frontend

# 이미지 빌드
docker build -t maltan-frontend:latest .

# 빌드 시 환경 변수 전달
docker build \
  --build-arg VITE_API_BASE_URL=http://localhost:8080 \
  --build-arg VITE_KAKAO_MAP_API_KEY=your_api_key \
  -t maltan-frontend:latest .
```

#### **2단계: Docker 컨테이너 실행**

```bash
# 컨테이너 실행
docker run -d \
  --name maltan-frontend \
  -p 3000:3000 \
  maltan-frontend:latest

# 로그 확인
docker logs -f maltan-frontend

# 중지
docker stop maltan-frontend

# 삭제
docker rm maltan-frontend
```

---

## 🔧 **Ubuntu 서버에서 실행하기**

### **1단계: 프로젝트 파일 전송**

#### **방법 A: Git 사용 (권장)**

```bash
# Ubuntu SSH 접속
ssh username@localhost -p 2222

# Git clone
cd ~
git clone https://github.com/KimNakYong/maltan_frontend.git
cd maltan_frontend
```

#### **방법 B: SCP로 파일 전송**

```bash
# Windows에서 실행
scp -P 2222 -r F:\3project\maltan-frontend username@localhost:~/maltan-frontend
```

### **2단계: Ubuntu에서 Docker 실행**

```bash
# SSH 접속
ssh username@localhost -p 2222

# 프론트엔드 폴더로 이동
cd ~/maltan-frontend

# Docker Compose로 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f frontend
```

### **3단계: 포트 포워딩 확인**

VirtualBox에서 포트 포워딩 설정:
- **이름**: frontend
- **프로토콜**: TCP
- **호스트 IP**: 127.0.0.1
- **호스트 포트**: 3000
- **게스트 IP**: (비워둠)
- **게스트 포트**: 3000

그러면 Windows에서 `http://localhost:3000` 으로 접속 가능합니다.

---

## 🌐 **전체 MSA와 함께 실행하기**

### **백엔드 + 프론트엔드 통합 실행**

#### **1. 백엔드 docker-compose.yml 수정**

`F:\3project\maltan-backend\docker\docker-compose.yml`에 프론트엔드 추가:

```yaml
services:
  # ... 기존 서비스들 ...

  frontend:
    build:
      context: ../../maltan-frontend
      dockerfile: Dockerfile
      args:
        VITE_API_BASE_URL: http://localhost:8080
    container_name: maltan-frontend
    ports:
      - "3000:3000"
    depends_on:
      - gateway-service
    networks:
      - maltan-network
    restart: unless-stopped
```

#### **2. 전체 서비스 실행**

```bash
# Ubuntu SSH 접속
ssh username@localhost -p 2222

# Docker 폴더로 이동
cd ~/maltan-project/docker

# 모든 서비스 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f frontend
```

---

## 🔍 **Docker 상태 확인**

### **컨테이너 상태 확인**

```bash
# 실행 중인 컨테이너 확인
docker ps

# 모든 컨테이너 확인
docker ps -a

# 프론트엔드 컨테이너만 확인
docker ps | grep maltan-frontend
```

### **로그 확인**

```bash
# 실시간 로그 확인
docker logs -f maltan-frontend

# 최근 100줄 로그
docker logs --tail 100 maltan-frontend

# Docker Compose로 로그 확인
docker-compose logs -f frontend
```

### **컨테이너 내부 접속**

```bash
# 컨테이너 쉘 접속
docker exec -it maltan-frontend sh

# nginx 설정 확인
docker exec maltan-frontend cat /etc/nginx/nginx.conf

# 빌드된 파일 확인
docker exec maltan-frontend ls -la /usr/share/nginx/html
```

---

## 🚨 **문제 해결**

### **1. 빌드 실패**

#### **문제: npm install 실패**
```
Error: ENOENT: no such file or directory
```

**해결:**
```bash
# node_modules 삭제 후 재빌드
rm -rf node_modules package-lock.json
docker-compose build --no-cache
```

#### **문제: 메모리 부족**
```
FATAL ERROR: Reached heap limit Allocation failed
```

**해결:**
Docker Desktop에서 메모리 할당 증가 (4GB → 6GB)

---

### **2. 컨테이너 실행 실패**

#### **문제: 포트 충돌**
```
Error: bind: address already in use
```

**해결:**
```bash
# 3000 포트 사용 중인 프로세스 확인
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Linux/Mac

# 프로세스 종료 후 다시 실행
docker-compose down
docker-compose up -d
```

---

### **3. 접속 실패**

#### **문제: http://localhost:3000 접속 안됨**

**확인 사항:**
1. 컨테이너가 실행 중인가?
   ```bash
   docker ps | grep maltan-frontend
   ```

2. 포트 매핑이 올바른가?
   ```bash
   docker port maltan-frontend
   ```

3. VirtualBox 포트 포워딩 설정 확인

4. 방화벽 확인
   ```bash
   # Windows 방화벽에서 3000 포트 허용
   ```

---

### **4. API 연동 실패**

#### **문제: CORS 에러**

**해결:**
백엔드 게이트웨이에서 CORS 설정:
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("*")
                .allowCredentials(true);
    }
}
```

#### **문제: API 요청 실패**

**nginx 프록시 사용:**
프론트엔드의 nginx가 `/api/` 요청을 백엔드로 프록시하도록 설정됨.

**직접 API 호출:**
`VITE_API_BASE_URL` 환경 변수를 백엔드 URL로 설정:
```bash
docker build --build-arg VITE_API_BASE_URL=http://gateway-service:8080 -t maltan-frontend .
```

---

## 📊 **리소스 사용량 확인**

```bash
# Docker 컨테이너 리소스 사용량
docker stats maltan-frontend

# Docker 이미지 크기 확인
docker images | grep maltan-frontend
```

---

## 🔄 **재빌드 및 재시작**

### **코드 변경 후 재배포**

```bash
# 1. 코드 변경

# 2. Docker 이미지 재빌드
docker-compose build --no-cache frontend

# 3. 컨테이너 재시작
docker-compose up -d frontend

# 4. 로그 확인
docker-compose logs -f frontend
```

### **빠른 재시작 (캐시 사용)**

```bash
# 캐시 사용하여 빠르게 빌드
docker-compose build frontend
docker-compose up -d frontend
```

---

## 🧹 **정리**

### **컨테이너 및 이미지 삭제**

```bash
# 컨테이너 중지 및 삭제
docker-compose down

# 이미지도 함께 삭제
docker-compose down --rmi all

# 볼륨도 함께 삭제
docker-compose down -v

# 수동으로 삭제
docker stop maltan-frontend
docker rm maltan-frontend
docker rmi maltan-frontend:latest
```

### **Docker 시스템 정리**

```bash
# 사용하지 않는 이미지 삭제
docker image prune

# 사용하지 않는 컨테이너 삭제
docker container prune

# 전체 시스템 정리
docker system prune -a
```

---

## 📝 **빠른 참조**

### **개발 워크플로우**

```bash
# === 로컬 개발 ===
npm run dev                          # 개발 서버 (http://localhost:5173)

# === Docker 테스트 ===
docker-compose up -d                 # Docker로 실행 (http://localhost:3000)
docker-compose logs -f frontend      # 로그 확인
docker-compose down                  # 중지

# === Ubuntu 배포 ===
git push origin develop              # Git 푸시
ssh username@localhost -p 2222       # SSH 접속
cd ~/maltan-frontend
git pull origin develop              # 최신 코드 받기
docker-compose build --no-cache      # 재빌드
docker-compose up -d                 # 재시작
```

---

## 🎉 **완료!**

이제 Docker로 프론트엔드를 실행할 수 있습니다!

```bash
# Windows에서 실행
cd F:\3project\maltan-frontend
docker-compose up -d

# 브라우저에서 확인
# http://localhost:3000
```

백엔드 서비스가 준비되면 전체 MSA 시스템을 Docker Compose로 통합 실행할 수 있습니다! 🚀

