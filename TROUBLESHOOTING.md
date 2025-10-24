# Docker 문제 해결 가이드

## 🚨 **문제: 컨테이너가 계속 재시작됨**

```
STATUS: Restarting (1) X seconds ago
```

---

## 🔍 **원인 파악**

### **1단계: 로그 확인**

```bash
# 컨테이너 로그 확인
docker logs maltan-frontend

# 또는 실시간 로그
docker logs -f maltan-frontend

# 또는 Docker Compose로
docker compose logs frontend
```

---

## 💡 **일반적인 원인과 해결 방법**

### **원인 1: Nginx 설정 파일 오류**

#### **증상:**
```
nginx: [emerg] unexpected end of file, expecting "}" in /etc/nginx/nginx.conf:XX
```

#### **해결:**

**nginx.conf 파일 확인:**

```bash
# Ubuntu에서
cat nginx.conf
```

**올바른 nginx.conf:**

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  65;

    server {
        listen       3000;
        server_name  localhost;

        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   /usr/share/nginx/html;
        }
    }
}
```

---

### **원인 2: 빌드된 파일이 없음**

#### **증상:**
```
[error] open() "/usr/share/nginx/html/index.html" failed (2: No such file or directory)
```

#### **해결:**

```bash
# 컨테이너 내부 확인
docker exec -it maltan-frontend sh
ls -la /usr/share/nginx/html
exit

# 빌드 폴더가 비어있다면 재빌드
docker compose down
docker compose build --no-cache
docker compose up -d
```

---

### **원인 3: 포트 충돌**

#### **증상:**
```
bind() to 0.0.0.0:3000 failed (98: Address already in use)
```

#### **해결:**

```bash
# 3000 포트 사용 중인 프로세스 확인
sudo lsof -i :3000

# 프로세스 종료
sudo kill -9 <PID>

# 또는 Docker 완전 재시작
docker compose down
docker ps -a
docker rm maltan-frontend
docker compose up -d
```

---

### **원인 4: 메모리 부족**

#### **증상:**
```
Cannot allocate memory
```

#### **해결:**

```bash
# 시스템 리소스 확인
free -h
df -h

# Docker 정리
docker system prune -a

# 불필요한 이미지 삭제
docker images
docker rmi <IMAGE_ID>
```

---

## 🛠️ **단계별 문제 해결**

### **Step 1: 로그 확인**

```bash
cd ~/maltan-project/maltan_frontend

# 로그 확인
docker logs maltan-frontend

# 마지막 50줄만
docker logs --tail 50 maltan-frontend
```

### **Step 2: 컨테이너 중지 및 삭제**

```bash
# 중지
docker compose down

# 완전 삭제
docker rm -f maltan-frontend

# 네트워크 확인
docker network ls
docker network prune
```

### **Step 3: 캐시 없이 재빌드**

```bash
# 캐시 없이 빌드
docker compose build --no-cache

# 실행
docker compose up -d

# 로그 확인
docker compose logs -f frontend
```

### **Step 4: 수동 테스트**

```bash
# nginx 설정 테스트
docker run --rm -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro nginx:alpine nginx -t

# 빌드된 파일 확인
ls -la build/
```

---

## 🔧 **즉시 해결 명령어**

```bash
# === 완전 재시작 ===
cd ~/maltan-project/maltan_frontend
docker compose down
docker rm -f maltan-frontend 2>/dev/null
docker compose build --no-cache
docker compose up -d
docker logs -f maltan-frontend

# === 문제가 지속되면 ===
# 1. 로그 저장
docker logs maltan-frontend > error.log
cat error.log

# 2. 컨테이너 내부 확인
docker exec -it maltan-frontend sh
ls -la /usr/share/nginx/html
cat /etc/nginx/nginx.conf
exit

# 3. 수동으로 nginx 실행 테스트
docker run --rm -p 3000:3000 -v $(pwd)/build:/usr/share/nginx/html:ro nginx:alpine
```

---

## 📊 **상태 확인 명령어**

```bash
# 컨테이너 상태
docker ps -a

# 상세 정보
docker inspect maltan-frontend

# 리소스 사용량
docker stats maltan-frontend

# 네트워크
docker network inspect maltan_frontend_maltan-network
```

---

## ✅ **체크리스트**

문제 발생 시 확인:

- [ ] 로그 확인 (`docker logs maltan-frontend`)
- [ ] nginx.conf 문법 확인
- [ ] build/ 폴더에 파일 있는지 확인
- [ ] 포트 3000 충돌 확인
- [ ] 메모리/디스크 공간 확인
- [ ] 최신 코드로 git pull 했는지 확인
- [ ] 캐시 없이 재빌드 시도

---

## 🎯 **가장 흔한 해결책**

```bash
# 99% 이것으로 해결됨
docker compose down
docker compose build --no-cache
docker compose up -d
docker logs -f maltan-frontend
```

---

이 가이드로 문제를 해결할 수 없다면, 로그를 공유해주세요!

