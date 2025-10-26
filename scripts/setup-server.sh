#!/bin/bash

# Ubuntu 서버 프론트엔드 배포 환경 설정 스크립트

echo "=========================================="
echo "Frontend 배포 환경 설정 시작"
echo "=========================================="

# 1. Nginx 설치
echo "1. Nginx 설치 중..."
sudo apt update
sudo apt install -y nginx

# 2. Node.js 18 설치
echo "2. Node.js 18 설치 중..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 버전 확인
echo "Node.js 버전: $(node --version)"
echo "npm 버전: $(npm --version)"

# 3. 배포 디렉토리 생성
echo "3. 배포 디렉토리 생성 중..."
sudo mkdir -p /var/www/maltan-frontend
sudo mkdir -p /var/www/maltan-frontend-backup
sudo chown -R www-data:www-data /var/www/maltan-frontend
sudo chmod -R 755 /var/www/maltan-frontend

# 4. Nginx 설정 파일 생성
echo "4. Nginx 설정 파일 생성 중..."
sudo tee /etc/nginx/sites-available/maltan-frontend > /dev/null <<'EOF'
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
    
    # Prometheus 프록시 (모니터링)
    location /api/prometheus/ {
        proxy_pass http://localhost:9090/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
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
EOF

# 5. 설정 활성화
echo "5. Nginx 설정 활성화 중..."
sudo ln -sf /etc/nginx/sites-available/maltan-frontend /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# 6. Nginx 설정 테스트 및 재시작
echo "6. Nginx 재시작 중..."
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

# 7. github-runner 사용자 권한 설정
echo "7. github-runner 사용자 권한 설정 중..."
if id "github-runner" &>/dev/null; then
    echo "github-runner 사용자가 이미 존재합니다."
    
    # sudoers 설정 추가
    echo "sudoers 설정 추가 중..."
    sudo tee /etc/sudoers.d/github-runner > /dev/null <<'SUDOERS'
github-runner ALL=(ALL) NOPASSWD: /bin/cp
github-runner ALL=(ALL) NOPASSWD: /bin/rm
github-runner ALL=(ALL) NOPASSWD: /bin/mkdir
github-runner ALL=(ALL) NOPASSWD: /bin/chown
github-runner ALL=(ALL) NOPASSWD: /bin/chmod
github-runner ALL=(ALL) NOPASSWD: /usr/sbin/nginx
github-runner ALL=(ALL) NOPASSWD: /bin/systemctl
SUDOERS
    
    sudo chmod 440 /etc/sudoers.d/github-runner
    
    # www-data 그룹에 추가
    sudo usermod -aG www-data github-runner
else
    echo "경고: github-runner 사용자가 존재하지 않습니다. Self-Hosted Runner를 먼저 설정하세요."
fi

# 8. 방화벽 설정 (UFW 사용 시)
echo "8. 방화벽 설정 중..."
if command -v ufw &> /dev/null; then
    sudo ufw allow 3000/tcp
    echo "포트 3000 허용됨"
fi

# 9. 상태 확인
echo "=========================================="
echo "설정 완료! 상태 확인 중..."
echo "=========================================="

echo ""
echo "✅ Nginx 상태:"
sudo systemctl status nginx --no-pager | head -5

echo ""
echo "✅ 배포 디렉토리:"
ls -la /var/www/maltan-frontend

echo ""
echo "✅ Nginx 설정 파일:"
ls -la /etc/nginx/sites-enabled/

echo ""
echo "✅ 포트 3000 리스닝:"
sudo netstat -tuln | grep :3000 || echo "아직 리스닝하지 않음"

echo ""
echo "=========================================="
echo "✅ 설정 완료!"
echo "=========================================="
echo ""
echo "다음 단계:"
echo "1. GitHub에서 Self-Hosted Runner 토큰 받기:"
echo "   https://github.com/YOUR_USERNAME/maltan_frontend/settings/actions/runners/new"
echo ""
echo "2. Runner 설정:"
echo "   cd ~/actions-runner-frontend"
echo "   ./config.sh --url https://github.com/YOUR_USERNAME/maltan_frontend --token YOUR_TOKEN"
echo "   sudo ./svc.sh install github-runner"
echo "   sudo ./svc.sh start"
echo ""
echo "3. GitHub Secrets 설정:"
echo "   - VITE_API_URL"
echo "   - VITE_GOOGLE_MAPS_API_KEY"
echo ""
echo "4. 코드 push하여 자동 배포 테스트"
echo ""

