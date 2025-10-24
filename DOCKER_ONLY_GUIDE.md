# Ubuntu Docker로만 실행하기 (Windows 개발 서버 종료)

## ✅ **Windows 개발 서버 종료 완료**

이제 Ubuntu Docker만 사용합니다!

---

## 🐧 **Ubuntu SSH 접속 및 Docker 실행**

### **1단계: Ubuntu SSH 접속**

Windows PowerShell 또는 CMD:

```bash
ssh username@localhost -p 2222
```

---

### **2단계: 최신 코드 받기**

```bash
cd ~/maltan-project/maltan_frontend
git pull origin main
```

**예상 출력:**
```
From https://github.com/KimNakYong/maltan_frontend
 * branch            main       -> FETCH_HEAD
Updating d75eab9..8ffe828
Fast-forward
 nginx.conf | 26 +++++++++++++-------------
 1 file changed, 13 insertions(+), 13 deletions(-)
```

---

### **3단계: Docker 완전 재시작**

```bash
# 기존 컨테이너 중지 및 삭제
docker compose down

# 캐시 없이 재빌드
docker compose build --no-cache

# 백그라운드로 실행
docker compose up -d
```

**빌드 과정 (약 3-5분):**
```
[+] Building 180.5s (15/15) FINISHED
 => [build 1/6] FROM docker.io/library/node:18-alpine
 => [build 2/6] WORKDIR /app
 => [build 3/6] COPY package*.json ./
 => [build 4/6] RUN npm ci
 => [build 5/6] COPY . .
 => [build 6/6] RUN npm run build
 => [stage-1 1/3] FROM docker.io/library/nginx:alpine
 => [stage-1 2/3] COPY --from=build /app/build /usr/share/nginx/html
 => [stage-1 3/3] COPY nginx.conf /etc/nginx/nginx.conf

[+] Running 2/2
 ✔ Network maltan_frontend_maltan-network  Created
 ✔ Container maltan-frontend                Started
```

---

### **4단계: 실행 상태 확인**

```bash
# 컨테이너 상태 확인
docker ps
```

**성공 시 출력:**
```
CONTAINER ID   IMAGE                      COMMAND                  CREATED         STATUS         PORTS                    NAMES
abc123def456   maltan_frontend-frontend  "/docker-entrypoint.…"   30 seconds ago  Up 28 seconds  0.0.0.0:3000->3000/tcp   maltan-frontend
```

**✅ STATUS가 "Up"이면 성공!**

---

### **5단계: 로그 확인**

```bash
# 로그 확인 (에러가 없어야 함)
docker logs maltan-frontend
```

**성공 시 출력 (마지막 부분):**
```
/docker-entrypoint.sh: Configuration complete; ready for start up
2025/10/22 14:20:00 [notice] 1#1: using the "epoll" event method
2025/10/22 14:20:00 [notice] 1#1: nginx/1.25.3
2025/10/22 14:20:00 [notice] 1#1: start worker processes
2025/10/22 14:20:00 [notice] 1#1: start worker process 29
```

**❌ 에러가 있다면:**
```bash
# 실시간 로그 확인
docker logs -f maltan-frontend

# Ctrl + C로 종료
```

---

### **6단계: Windows 브라우저에서 접속**

```
http://localhost:3000
```

또는

```
http://localhost:3000/map-test
```

**✅ 성공하면 프론트엔드가 표시됩니다!**

---

## 🔄 **이후 코드 수정 시**

### **Windows에서 코드 수정 후:**

```bash
# 1. Git 커밋 및 푸시
cd F:\3project\maltan-frontend
git add .
git commit -m "feat: update something"
git push origin main
```

### **Ubuntu에서 업데이트:**

```bash
# 1. SSH 접속
ssh username@localhost -p 2222

# 2. 최신 코드 받기
cd ~/maltan-project/maltan_frontend
git pull origin main

# 3. Docker 재시작
docker compose down
docker compose up -d --build

# 4. 확인
docker ps
docker logs -f maltan-frontend
```

---

## 📊 **유용한 명령어**

### **Docker 상태 관리**

```bash
# 실행 중인 컨테이너 확인
docker ps

# 모든 컨테이너 확인 (중지된 것 포함)
docker ps -a

# 컨테이너 시작
docker compose up -d

# 컨테이너 중지
docker compose down

# 컨테이너 재시작
docker compose restart

# 로그 실시간 확인
docker logs -f maltan-frontend

# 컨테이너 내부 접속
docker exec -it maltan-frontend sh
```

### **리소스 확인**

```bash
# 컨테이너 리소스 사용량
docker stats maltan-frontend

# 디스크 사용량
docker system df

# 빌드된 파일 확인 (컨테이너 내부)
docker exec maltan-frontend ls -la /usr/share/nginx/html
```

### **문제 해결**

```bash
# 완전 재시작
docker compose down
docker rm -f maltan-frontend
docker compose build --no-cache
docker compose up -d

# 로그 저장
docker logs maltan-frontend > ~/frontend-error.log
cat ~/frontend-error.log

# 네트워크 확인
docker network ls
docker network inspect maltan_frontend_maltan-network
```

---

## 🚨 **문제 발생 시**

### **문제 1: 컨테이너가 계속 재시작됨**

```bash
# 로그 확인
docker logs maltan-frontend

# 원인 파악 후 재빌드
docker compose down
docker compose build --no-cache
docker compose up -d
```

### **문제 2: 포트 충돌**

```bash
# 3000 포트 사용 확인
sudo lsof -i :3000

# 프로세스 종료
sudo kill -9 <PID>

# Docker 재시작
docker compose down
docker compose up -d
```

### **문제 3: 빌드 실패**

```bash
# Git 상태 확인
git status
git pull origin main

# 완전 재빌드
docker compose down
docker system prune -a  # 주의: 모든 Docker 데이터 삭제
docker compose build --no-cache
docker compose up -d
```

---

## ✅ **성공 체크리스트**

- [ ] Windows 개발 서버 종료 완료
- [ ] Ubuntu SSH 접속 성공
- [ ] `git pull` 성공
- [ ] `docker compose build` 성공
- [ ] `docker compose up -d` 성공
- [ ] `docker ps` 에서 STATUS: Up 확인
- [ ] `docker logs` 에서 에러 없음
- [ ] http://localhost:3000 접속 성공
- [ ] Google Maps 정상 작동

---

## 🎯 **빠른 명령어 모음 (복사용)**

### **Ubuntu에서 실행:**

```bash
# === 최초 실행 ===
cd ~/maltan-project/maltan_frontend
git pull origin main
docker compose down
docker compose build --no-cache
docker compose up -d
docker ps
docker logs -f maltan-frontend

# === 코드 업데이트 후 ===
cd ~/maltan-project/maltan_frontend
git pull origin main
docker compose down
docker compose up -d --build
docker logs -f maltan-frontend

# === 빠른 재시작 ===
docker compose restart
docker logs -f maltan-frontend

# === 문제 해결 ===
docker compose down
docker rm -f maltan-frontend
docker compose build --no-cache
docker compose up -d
docker logs maltan-frontend
```

---

## 🌐 **외부 접속 (선택사항)**

같은 네트워크의 다른 사람이 접속하려면:

### **1. Ubuntu IP 확인**

```bash
ip addr show | grep inet
```

**출력 예시:**
```
inet 192.168.1.100/24  ← 이 IP 사용
```

### **2. 다른 사람 접속**

```
http://192.168.1.100:3000
```

**참고:** VirtualBox 브리지 어댑터 설정이 필요할 수 있습니다.
자세한 내용은 `EXTERNAL_ACCESS_GUIDE.md` 참고

---

## 🎉 **완료!**

이제 Ubuntu Docker에서만 프론트엔드가 실행됩니다!

```
✅ Windows 개발 서버: 종료됨
✅ Ubuntu Docker: 실행 중
✅ 접속: http://localhost:3000
```

**다음 단계: 백엔드 User Service 개발!** 🚀

