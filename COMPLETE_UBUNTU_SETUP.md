# Ubuntu 가상머신 완전 설정 가이드 (처음부터 끝까지)

## 📋 **전체 과정 개요**

1. ✅ VirtualBox Ubuntu 설정 확인
2. 🐧 Ubuntu SSH 접속
3. 🐳 Docker 설치
4. 📦 Git 설치
5. 🗺️ 프론트엔드 Clone 및 실행
6. 🌐 Windows에서 접속

---

## 1️⃣ **VirtualBox 설정 확인**

### **포트 포워딩 설정**

VirtualBox 관리자 → 가상머신 선택 → 설정 → 네트워크 → 고급 → 포트 포워딩

#### **필수 포트:**

| 이름 | 프로토콜 | 호스트 IP | 호스트 포트 | 게스트 포트 |
|------|---------|-----------|-------------|-------------|
| SSH | TCP | 127.0.0.1 | 2222 | 22 |
| Frontend | TCP | 127.0.0.1 | 3000 | 3000 |

---

## 2️⃣ **Ubuntu SSH 접속**

### **Windows PowerShell 또는 CMD에서:**

```bash
ssh username@localhost -p 2222
```

**비밀번호 입력 후 접속**

---

## 3️⃣ **Docker 설치**

### **방법 1: 자동 설치 스크립트 (권장)**

```bash
# 1. 이전 Docker 제거 (있다면)
sudo apt remove docker docker-engine docker.io containerd runc -y

# 2. 필수 패키지 설치
sudo apt update
sudo apt install -y ca-certificates curl gnupg lsb-release

# 3. Docker GPG 키 추가
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# 4. Docker 저장소 추가
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 5. 패키지 목록 업데이트
sudo apt update

# 6. Docker 설치
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 7. 현재 사용자를 docker 그룹에 추가
sudo usermod -aG docker $USER

# 8. Docker 서비스 시작
sudo systemctl start docker
sudo systemctl enable docker

# 9. 그룹 변경 적용 (새 세션 시작)
newgrp docker
```

### **설치 확인:**

```bash
# Docker 버전 확인
docker --version
# 출력 예: Docker version 24.0.7, build afdd53b

# Docker Compose 버전 확인
docker compose version
# 출력 예: Docker Compose version v2.23.0

# Docker 서비스 상태 확인
sudo systemctl status docker
# 출력: active (running)

# Hello World 테스트
docker run hello-world
```

**성공 메시지:**
```
Hello from Docker!
This message shows that your installation appears to be working correctly.
```

---

## 4️⃣ **Git 설치 및 설정**

### **Git 설치:**

```bash
# Git 설치
sudo apt update
sudo apt install -y git

# Git 버전 확인
git --version
# 출력 예: git version 2.34.1
```

### **Git 설정 (선택사항):**

```bash
# Git 사용자 설정
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 설정 확인
git config --list
```

---

## 5️⃣ **프론트엔드 Clone 및 실행**

### **Step 1: 프로젝트 디렉토리 생성**

```bash
# 홈 디렉토리로 이동
cd ~

# 프로젝트 폴더 생성
mkdir -p maltan-project
cd maltan-project

# 현재 위치 확인
pwd
# 출력: /home/username/maltan-project
```

### **Step 2: GitHub에서 Clone**

```bash
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
drwxrwxr-x  8 user user  4096 Oct 22 10:00 .git
-rw-rw-r--  1 user user  1234 Oct 22 10:00 Dockerfile
-rw-rw-r--  1 user user   789 Oct 22 10:00 docker-compose.yml
-rw-rw-r--  1 user user   567 Oct 22 10:00 nginx.conf
-rw-rw-r--  1 user user  2345 Oct 22 10:00 package.json
drwxrwxr-x  2 user user  4096 Oct 22 10:00 public
-rw-rw-r--  1 user user  5678 Oct 22 10:00 README.md
drwxrwxr-x  8 user user  4096 Oct 22 10:00 src
...
```

### **Step 3: Docker 이미지 빌드 및 실행**

```bash
# Docker Compose로 빌드 및 실행 (한 번에!)
docker compose up -d --build
```

**빌드 과정 (약 3-5분 소요):**
```
[+] Building 180.5s (15/15) FINISHED
 => [internal] load build definition from Dockerfile
 => [internal] load .dockerignore
 => [internal] load metadata for docker.io/library/nginx:alpine
 => [internal] load metadata for docker.io/library/node:18-alpine
 => [build 1/6] FROM docker.io/library/node:18-alpine
 => [build 2/6] WORKDIR /app
 => [build 3/6] COPY package*.json ./
 => [build 4/6] RUN npm ci                    ← 여기서 시간이 좀 걸립니다
 => [build 5/6] COPY . .
 => [build 6/6] RUN npm run build             ← 빌드 중...
 => [stage-1 1/3] FROM docker.io/library/nginx:alpine
 => [stage-1 2/3] COPY --from=build /app/dist /usr/share/nginx/html
 => [stage-1 3/3] COPY nginx.conf /etc/nginx/nginx.conf
 => exporting to image
 => => writing image sha256:abc123...
 
[+] Running 2/2
 ✔ Network maltan_frontend_maltan-network  Created
 ✔ Container maltan-frontend                Started
```

### **Step 4: 실행 상태 확인**

```bash
# 컨테이너 실행 확인
docker ps
```

**예상 출력:**
```
CONTAINER ID   IMAGE                        COMMAND                  CREATED         STATUS         PORTS                    NAMES
abc123def456   maltan_frontend-frontend    "/docker-entrypoint.…"   2 minutes ago   Up 2 minutes   0.0.0.0:3000->3000/tcp   maltan-frontend
```

```bash
# 로그 확인 (실시간)
docker compose logs -f frontend

# Ctrl + C로 종료
```

**성공적인 로그:**
```
maltan-frontend  | /docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
maltan-frontend  | /docker-entrypoint.sh: Configuration complete; ready for start up
maltan-frontend  | 2024/10/22 10:00:00 [notice] 1#1: nginx/1.25.x
maltan-frontend  | 2024/10/22 10:00:00 [notice] 1#1: start worker processes
```

---

## 6️⃣ **Windows에서 접속 확인**

### **Windows 브라우저에서:**

```
http://localhost:3000
```

**또는 지도 테스트 페이지:**
```
http://localhost:3000/map-test
```

### **성공 확인:**
- ✅ 홈 페이지가 정상적으로 표시됨
- ✅ 네비게이션 메뉴가 보임
- ✅ 지도 테스트 페이지에서 Google Maps가 로드됨

---

## 🔍 **문제 해결**

### **문제 1: Docker 설치 실패**

#### **증상:**
```
E: Unable to locate package docker-ce
```

#### **해결:**
```bash
# Docker 저장소 재추가
sudo rm /etc/apt/sources.list.d/docker.list
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

---

### **문제 2: Permission Denied (docker 명령어 실행 시)**

#### **증상:**
```
docker: permission denied while trying to connect to the Docker daemon socket
```

#### **해결:**
```bash
# 현재 사용자를 docker 그룹에 추가
sudo usermod -aG docker $USER

# 재로그인 또는
newgrp docker

# 테스트
docker run hello-world
```

---

### **문제 3: Docker Compose 빌드 실패**

#### **증상:**
```
ERROR: failed to solve: process "/bin/sh -c npm ci" did not complete successfully
```

#### **해결:**
```bash
# 캐시 없이 재빌드
docker compose down
docker compose build --no-cache
docker compose up -d
```

---

### **문제 4: 포트 충돌**

#### **증상:**
```
Error: bind: address already in use
```

#### **해결:**
```bash
# 3000 포트 사용 중인 프로세스 확인
sudo lsof -i :3000

# 프로세스 종료 (PID는 위에서 확인)
sudo kill -9 <PID>

# 또는 Docker Compose 재시작
docker compose down
docker compose up -d
```

---

### **문제 5: Windows에서 접속 안됨**

#### **체크리스트:**

1. **Ubuntu에서 컨테이너 실행 중인가?**
   ```bash
   docker ps | grep maltan-frontend
   ```

2. **VirtualBox 포트 포워딩 설정했나?**
   - VirtualBox 관리자 → 설정 → 네트워크 → 포트 포워딩
   - Frontend: 3000 → 3000

3. **Ubuntu 방화벽 확인**
   ```bash
   sudo ufw status
   
   # 방화벽이 활성화되어 있다면
   sudo ufw allow 3000/tcp
   ```

4. **컨테이너 로그 확인**
   ```bash
   docker compose logs frontend
   ```

---

## 📊 **유용한 명령어 모음**

### **Docker 관리**

```bash
# 컨테이너 실행 상태 확인
docker ps

# 모든 컨테이너 확인 (중지된 것 포함)
docker ps -a

# 컨테이너 중지
docker compose down

# 컨테이너 시작
docker compose up -d

# 컨테이너 재시작
docker compose restart

# 로그 확인 (실시간)
docker compose logs -f frontend

# 컨테이너 내부 접속
docker exec -it maltan-frontend sh

# 컨테이너 삭제 (이미지는 유지)
docker compose down

# 컨테이너 + 이미지 삭제
docker compose down --rmi all
```

### **시스템 모니터링**

```bash
# 컨테이너 리소스 사용량
docker stats maltan-frontend

# 디스크 사용량
docker system df

# 불필요한 이미지/컨테이너 정리
docker system prune -a
```

---

## 🔄 **코드 업데이트 시**

### **Windows에서 코드 수정 후:**

```bash
# Windows
cd F:\3project\maltan-frontend
git add .
git commit -m "feat: update feature"
git push origin main
```

### **Ubuntu에서 업데이트 적용:**

```bash
# Ubuntu SSH 접속
ssh username@localhost -p 2222

# 프로젝트 폴더로 이동
cd ~/maltan-project/maltan_frontend

# 최신 코드 받기
git pull origin main

# Docker 재빌드 및 재시작
docker compose down
docker compose up -d --build

# 로그 확인
docker compose logs -f frontend
```

---

## 🎯 **전체 명령어 요약 (복사용)**

### **최초 설정 (Ubuntu SSH 접속 후)**

```bash
# === 1. Docker 설치 ===
sudo apt update
sudo apt install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
sudo systemctl start docker
sudo systemctl enable docker
newgrp docker

# === 2. Git 설치 ===
sudo apt install -y git

# === 3. 프로젝트 Clone ===
cd ~
mkdir -p maltan-project
cd maltan-project
git clone https://github.com/KimNakYong/maltan_frontend.git
cd maltan_frontend

# === 4. Docker 실행 ===
docker compose up -d --build

# === 5. 확인 ===
docker ps
docker compose logs -f frontend
```

### **이후 업데이트 시 (Ubuntu)**

```bash
cd ~/maltan-project/maltan_frontend
git pull origin main
docker compose down
docker compose up -d --build
```

---

## ✅ **최종 체크리스트**

### **설치 완료 확인:**

- [ ] Docker 설치 완료 (`docker --version`)
- [ ] Docker Compose 설치 완료 (`docker compose version`)
- [ ] Docker 서비스 실행 중 (`sudo systemctl status docker`)
- [ ] Git 설치 완료 (`git --version`)
- [ ] 프로젝트 Clone 완료 (`ls ~/maltan-project/maltan_frontend`)
- [ ] Docker 컨테이너 실행 중 (`docker ps`)
- [ ] VirtualBox 포트 포워딩 설정 (3000 → 3000)

### **테스트 완료 확인:**

- [ ] http://localhost:3000 접속 가능
- [ ] http://localhost:3000/map-test 접속 가능
- [ ] Google Maps 정상 표시
- [ ] 검색 기능 작동

---

## 🎉 **완료!**

이제 Ubuntu 가상머신의 Docker에서 프론트엔드가 실행됩니다!

```
✅ Ubuntu: Docker 설치 완료
✅ Ubuntu: 프론트엔드 컨테이너 실행
✅ Windows: http://localhost:3000 접속 가능
✅ Google Maps API: 정상 작동
```

**다음 단계: 백엔드 User Service 개발!** 🚀

