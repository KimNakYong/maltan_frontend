# Ubuntu 가상머신에서 프론트엔드 Docker 실행 가이드

## 🐧 **전체 프로세스**

1. ✅ Windows에서 GitHub에 푸시 완료
2. Ubuntu SSH 접속
3. Git Clone
4. Docker 빌드
5. Docker 실행
6. Windows에서 접속

---

## 📝 **단계별 실행**

### **1단계: Ubuntu SSH 접속**

Windows PowerShell 또는 CMD에서:

```bash
ssh username@localhost -p 2222
```

**비밀번호 입력 후 접속**

---

### **2단계: 프로젝트 폴더 생성 및 Git Clone**

```bash
# 홈 디렉토리로 이동
cd ~

# 프로젝트 폴더 생성
mkdir -p maltan-project
cd maltan-project

# 프론트엔드 Clone
git clone https://github.com/KimNakYong/maltan_frontend.git

# 폴더로 이동
cd maltan_frontend

# 파일 확인
ls -la
```

**예상 출력:**
```
total 120
drwxrwxr-x  6 user user  4096 Oct 22 10:00 .
drwxrwxr-x  3 user user  4096 Oct 22 10:00 ..
-rw-rw-r--  1 user user   234 Oct 22 10:00 .dockerignore
-rw-rw-r--  1 user user   456 Oct 22 10:00 .gitignore
-rw-rw-r--  1 user user  1234 Oct 22 10:00 Dockerfile
-rw-rw-r--  1 user user   789 Oct 22 10:00 docker-compose.yml
-rw-rw-r--  1 user user   567 Oct 22 10:00 nginx.conf
-rw-rw-r--  1 user user  2345 Oct 22 10:00 package.json
drwxrwxr-x  2 user user  4096 Oct 22 10:00 public
-rw-rw-r--  1 user user  5678 Oct 22 10:00 README.md
drwxrwxr-x  8 user user  4096 Oct 22 10:00 src
...
```

---

### **3단계: Docker Compose로 빌드 및 실행**

```bash
# Docker Compose로 빌드 및 실행 (한 번에!)
docker-compose up -d --build

# 또는 단계별로:
# 1. 빌드만
docker-compose build

# 2. 실행
docker-compose up -d
```

**빌드 시간**: 약 3-5분 소요 (처음에만)

**예상 출력:**
```
[+] Building 180.5s (15/15) FINISHED
 => [internal] load build definition from Dockerfile
 => => transferring dockerfile: 1.02kB
 => [internal] load .dockerignore
 => => transferring context: 234B
 => [internal] load metadata for docker.io/library/nginx:alpine
 => [internal] load metadata for docker.io/library/node:18-alpine
 => [build 1/6] FROM docker.io/library/node:18-alpine
 => [build 2/6] WORKDIR /app
 => [build 3/6] COPY package*.json ./
 => [build 4/6] RUN npm ci
 => [build 5/6] COPY . .
 => [build 6/6] RUN npm run build
 => [stage-1 1/3] FROM docker.io/library/nginx:alpine
 => [stage-1 2/3] COPY --from=build /app/dist /usr/share/nginx/html
 => [stage-1 3/3] COPY nginx.conf /etc/nginx/nginx.conf
 => exporting to image
 => => exporting layers
 => => writing image sha256:abc123...
 => => naming to docker.io/library/maltan_frontend-frontend

[+] Running 2/2
 ✔ Network maltan_frontend_maltan-network  Created
 ✔ Container maltan-frontend                Started
```

---

### **4단계: 실행 상태 확인**

```bash
# 컨테이너 실행 확인
docker ps

# 로그 확인
docker-compose logs -f frontend

# 또는
docker logs -f maltan-frontend
```

**예상 출력 (docker ps):**
```
CONTAINER ID   IMAGE                        COMMAND                  CREATED         STATUS         PORTS                    NAMES
abc123def456   maltan_frontend-frontend    "/docker-entrypoint.…"   2 minutes ago   Up 2 minutes   0.0.0.0:3000->3000/tcp   maltan-frontend
```

---

### **5단계: 컨테이너 내부 확인 (선택사항)**

```bash
# 컨테이너 내부 접속
docker exec -it maltan-frontend sh

# 빌드된 파일 확인
ls -la /usr/share/nginx/html

# nginx 설정 확인
cat /etc/nginx/nginx.conf

# 종료
exit
```

---

### **6단계: VirtualBox 포트 포워딩 설정**

**VirtualBox 관리자에서:**

1. 가상머신 선택 → 설정 → 네트워크 → 고급 → 포트 포워딩
2. 새 규칙 추가:
   - **이름**: frontend
   - **프로토콜**: TCP
   - **호스트 IP**: 127.0.0.1
   - **호스트 포트**: 3000
   - **게스트 IP**: (비워둠)
   - **게스트 포트**: 3000
3. 확인

---

### **7단계: Windows에서 브라우저로 접속**

Windows 브라우저에서:

```
http://localhost:3000
```

**또는**

```
http://localhost:3000/map-test
```

---

## 🔍 **문제 해결**

### **1. Docker 빌드 실패**

**증상:**
```
ERROR: failed to solve: process "/bin/sh -c npm ci" did not complete successfully
```

**해결:**
```bash
# 캐시 없이 재빌드
docker-compose build --no-cache

# 또는
docker-compose down
docker-compose up -d --build --no-cache
```

---

### **2. 포트 충돌**

**증상:**
```
Error: bind: address already in use
```

**해결:**
```bash
# 3000 포트 사용 중인 프로세스 확인
sudo lsof -i :3000

# 프로세스 종료
sudo kill -9 <PID>

# 또는 Docker Compose 재시작
docker-compose down
docker-compose up -d
```

---

### **3. 컨테이너 실행 안됨**

**증상:**
```
Container exited with code 1
```

**해결:**
```bash
# 로그 확인
docker-compose logs frontend

# 컨테이너 재시작
docker-compose restart frontend

# 또는 전체 재시작
docker-compose down
docker-compose up -d
```

---

### **4. Windows에서 접속 안됨**

**체크 리스트:**

1. **Ubuntu에서 컨테이너 실행 중인가?**
   ```bash
   docker ps | grep maltan-frontend
   ```

2. **포트 포워딩 설정했는가?**
   - VirtualBox 포트 포워딩 확인

3. **Ubuntu 방화벽 확인**
   ```bash
   sudo ufw status
   sudo ufw allow 3000/tcp
   ```

4. **Windows 방화벽 확인**
   - Windows Defender 방화벽에서 3000 포트 허용

---

## 📊 **유용한 명령어**

### **컨테이너 관리**

```bash
# 실행 중인 컨테이너 확인
docker ps

# 모든 컨테이너 확인
docker ps -a

# 컨테이너 중지
docker-compose down

# 컨테이너 시작
docker-compose up -d

# 컨테이너 재시작
docker-compose restart

# 로그 실시간 확인
docker-compose logs -f frontend

# 컨테이너 삭제 (이미지는 유지)
docker-compose down

# 컨테이너 + 이미지 삭제
docker-compose down --rmi all
```

### **리소스 모니터링**

```bash
# 컨테이너 리소스 사용량
docker stats maltan-frontend

# 디스크 사용량
docker system df

# 컨테이너 상세 정보
docker inspect maltan-frontend
```

---

## 🔄 **코드 업데이트 시**

### **Windows에서:**

```bash
# 코드 수정 후
cd F:\3project\maltan-frontend
git add .
git commit -m "feat: update feature"
git push origin main
```

### **Ubuntu에서:**

```bash
# Ubuntu SSH 접속
ssh username@localhost -p 2222

# 프로젝트 폴더로 이동
cd ~/maltan-project/maltan_frontend

# 최신 코드 받기
git pull origin main

# Docker 재빌드 및 재시작
docker-compose down
docker-compose up -d --build

# 로그 확인
docker-compose logs -f frontend
```

---

## 🎯 **전체 Docker 명령어 요약**

```bash
# === 최초 설정 ===
cd ~
mkdir -p maltan-project
cd maltan-project
git clone https://github.com/KimNakYong/maltan_frontend.git
cd maltan_frontend

# === Docker 실행 ===
docker-compose up -d --build

# === 상태 확인 ===
docker ps
docker-compose logs -f frontend

# === 재시작 ===
docker-compose restart

# === 중지 ===
docker-compose down

# === 코드 업데이트 후 재배포 ===
git pull origin main
docker-compose down
docker-compose up -d --build
```

---

## ✅ **체크리스트**

배포 전 확인:

- [ ] Docker 설치 확인 (`docker --version`)
- [ ] Docker Compose 설치 확인 (`docker-compose --version`)
- [ ] Git 설치 확인 (`git --version`)
- [ ] GitHub 코드 최신 상태 확인
- [ ] VirtualBox 포트 포워딩 설정 (3000 → 3000)

배포 후 확인:

- [ ] 컨테이너 실행 중 (`docker ps`)
- [ ] 로그에 에러 없음 (`docker-compose logs frontend`)
- [ ] Windows에서 http://localhost:3000 접속 가능
- [ ] 지도 테스트 페이지 작동 (http://localhost:3000/map-test)

---

## 🎉 **완료!**

이제 Ubuntu 가상머신의 Docker에서 프론트엔드가 실행됩니다!

```
✅ Ubuntu: Docker 컨테이너 실행
✅ Windows: http://localhost:3000 접속
✅ Google Maps API: 정상 작동
```

**다음 단계: 백엔드 개발 및 연동!** 🚀

