# Frontend 자동 배포 가이드

## 📋 개요

이 가이드는 GitHub Actions Self-Hosted Runner를 사용하여 프론트엔드를 Ubuntu 서버에 자동으로 배포하는 방법을 설명합니다.

## 🚀 배포 아키텍처

```
GitHub (main push)
    ↓
GitHub Actions (Self-Hosted Runner on Ubuntu)
    ↓
1. 코드 체크아웃
2. Node.js 설정
3. 의존성 설치 (npm ci)
4. .env 파일 생성 (Secrets 사용)
5. 빌드 (npm run build)
6. Nginx 배포 디렉토리로 복사
7. Nginx 리로드
8. Health Check
```

## 🔧 Ubuntu 서버 설정

### 1. Nginx 설치 및 설정

```bash
# Nginx 설치
sudo apt update
sudo apt install -y nginx

# 배포 디렉토리 생성
sudo mkdir -p /var/www/maltan-frontend
sudo chown -R www-data:www-data /var/www/maltan-frontend
sudo chmod -R 755 /var/www/maltan-frontend

# Nginx 설정 파일 생성
sudo nano /etc/nginx/sites-available/maltan-frontend
```

**Nginx 설정 내용:**

```nginx
server {
    listen 3000;
    server_name localhost;
    
    root /var/www/maltan-frontend;
    index index.html;
    
    # SPA를 위한 설정 (모든 경로를 index.html로)
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API 프록시 (백엔드로 전달)
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 정적 파일 캐싱
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip 압축
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;
}
```

**설정 활성화:**

```bash
# 심볼릭 링크 생성
sudo ln -s /etc/nginx/sites-available/maltan-frontend /etc/nginx/sites-enabled/

# 기본 사이트 비활성화 (선택사항)
sudo rm /etc/nginx/sites-enabled/default

# 설정 테스트
sudo nginx -t

# Nginx 재시작
sudo systemctl restart nginx
sudo systemctl enable nginx

# 상태 확인
sudo systemctl status nginx
```

### 2. Self-Hosted Runner 설정

이미 백엔드에서 설정한 Self-Hosted Runner를 사용합니다. 프론트엔드 리포지토리에서도 같은 Runner를 사용할 수 있습니다.

**프론트엔드 리포지토리에서 Runner 추가:**

```bash
# 프론트엔드 리포지토리용 Runner 추가
cd ~
mkdir -p ~/actions-runner-frontend
cd ~/actions-runner-frontend

# Runner 다운로드
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz

tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz

# 설정 (GitHub에서 토큰 받아서 실행)
# https://github.com/YOUR_USERNAME/maltan_frontend/settings/actions/runners/new
./config.sh --url https://github.com/YOUR_USERNAME/maltan_frontend --token YOUR_TOKEN

# 서비스로 설치
sudo ./svc.sh install github-runner
sudo ./svc.sh start
sudo ./svc.sh status
```

### 3. Runner에 sudo 권한 부여

프론트엔드 배포 시 Nginx 관련 명령어 실행을 위해 sudo 권한이 필요합니다:

```bash
# sudoers 파일 편집
sudo visudo

# 파일 맨 아래에 다음 줄 추가:
github-runner ALL=(ALL) NOPASSWD: /bin/cp, /bin/rm, /bin/mkdir, /bin/chown, /bin/chmod, /usr/sbin/nginx, /bin/systemctl

# 저장: Ctrl+O, Enter, Ctrl+X
```

### 4. Node.js 설치

```bash
# Node.js 18 설치
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 버전 확인
node --version  # v18.x.x
npm --version   # 9.x.x
```

## 🔐 GitHub Secrets 설정

프론트엔드 리포지토리에서 Settings → Secrets and variables → Actions → New repository secret:

1. **VITE_API_URL**
   - Value: `http://10.0.2.15:8080/api` (또는 실제 API URL)

2. **VITE_GOOGLE_MAPS_API_KEY**
   - Value: `AIzaSyB6yKm_vZw2nCWECG9Ju_Ytg2i19W3L96s`

## 📝 배포 프로세스

### 자동 배포 트리거

```bash
# Windows에서
cd F:\3project\maltan-frontend

# 코드 수정 후
git add .
git commit -m "feat: 새로운 기능 추가"
git push origin main

# → GitHub Actions 자동 실행
# → Ubuntu 서버에서 빌드 및 배포
# → Nginx 자동 리로드
```

### 수동 배포

GitHub Actions 페이지에서 "Run workflow" 버튼 클릭

## 🧪 배포 확인

### Ubuntu 서버에서 확인

```bash
# Nginx 상태
sudo systemctl status nginx

# 배포된 파일 확인
ls -la /var/www/maltan-frontend

# 로그 확인
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# 직접 접속 테스트
curl http://localhost:3000
```

### Windows에서 확인

```bash
# ngrok이 실행 중이라면
http://your-ngrok-url:3000

# 또는 VirtualBox 포트포워딩 설정 후
http://localhost:3000
```

## 🔥 트러블슈팅

### 1. Permission Denied

```bash
# Runner 사용자에게 권한 부여
sudo chown -R github-runner:github-runner /var/www/maltan-frontend
sudo usermod -aG www-data github-runner
```

### 2. Nginx 설정 오류

```bash
# 설정 파일 문법 체크
sudo nginx -t

# 에러 로그 확인
sudo tail -f /var/log/nginx/error.log
```

### 3. 빌드 실패

```bash
# Runner 로그 확인
sudo journalctl -u actions.runner.*.service -f

# Node.js 버전 확인
node --version  # 18.x.x 이상
```

### 4. API 연결 실패

```bash
# 백엔드 서비스 확인
docker ps | grep gateway-service

# 포트 확인
sudo netstat -tuln | grep 8080

# Nginx 프록시 설정 확인
sudo nginx -t
```

## 📊 모니터링

### GitHub Actions

- https://github.com/YOUR_USERNAME/maltan_frontend/actions
- 배포 히스토리 및 로그 확인

### Ubuntu 서버

```bash
# Nginx 상태
sudo systemctl status nginx

# 접속 로그
sudo tail -f /var/log/nginx/access.log

# 에러 로그
sudo tail -f /var/log/nginx/error.log

# 디스크 사용량
df -h /var/www/maltan-frontend
```

## 🎯 최적화 팁

### 1. 캐시 무효화

새 배포 시 브라우저 캐시 문제를 방지하려면 빌드 파일에 해시 추가 (Vite가 자동으로 처리)

### 2. Gzip 압축

Nginx 설정에 Gzip 압축 활성화 (위 설정 파일에 포함)

### 3. HTTPS 설정

프로덕션 환경에서는 Let's Encrypt를 사용한 HTTPS 설정 권장

### 4. CDN 사용

정적 파일을 CDN에 업로드하여 성능 향상

## 📚 참고 자료

- [GitHub Actions Self-Hosted Runner](https://docs.github.com/en/actions/hosting-your-own-runners)
- [Nginx 공식 문서](https://nginx.org/en/docs/)
- [Vite 배포 가이드](https://vitejs.dev/guide/static-deploy.html)

