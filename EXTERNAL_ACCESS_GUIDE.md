# 외부 개발자 접속 가이드

## 🌐 **다른 개발자가 프론트엔드에 접속하는 방법**

현재 Ubuntu VM의 Docker에서 프론트엔드가 실행 중입니다.  
다른 개발자가 접속할 수 있는 방법을 안내합니다.

---

## 📍 **방법 1: 같은 네트워크 내 접속 (LAN/Wi-Fi)**

### **Step 1: Ubuntu VM의 IP 주소 확인**

Ubuntu 터미널에서:

```bash
# IP 주소 확인
hostname -I
```

**또는**

```bash
ip addr show
```

예상 출력:
```
192.168.1.50  # <- 이 IP를 사용
```

### **Step 2: VirtualBox 네트워크 설정**

#### **현재 설정: NAT + 포트포워딩**

만약 **NAT** 네트워크를 사용 중이라면, 호스트 PC의 IP를 사용합니다.

**호스트 PC의 IP 확인 (Windows):**

```powershell
ipconfig | findstr IPv4
```

예상 출력:
```
IPv4 주소 . . . . . . . . . : 192.168.1.100  # <- 이 IP 사용
```

#### **포트 포워딩 확인**

VirtualBox 관리자 → VM 선택 → 설정 → 네트워크 → 고급 → 포트 포워딩

| 이름 | 프로토콜 | 호스트 IP | 호스트 포트 | 게스트 포트 |
|------|---------|-----------|-------------|-------------|
| Frontend | TCP | (비움) | 3000 | 3000 |

**중요:** 호스트 IP는 비워두면 모든 인터페이스에서 접속 가능합니다.

### **Step 3: Windows 방화벽 허용**

**방법 A: PowerShell (관리자 권한)**

```powershell
netsh advfirewall firewall add rule name="Maltan Frontend 3000" dir=in action=allow protocol=TCP localport=3000
```

**방법 B: GUI**

1. Windows 검색 → "방화벽"
2. "고급 보안이 포함된 Windows Defender 방화벽" 열기
3. 왼쪽 "인바운드 규칙" 선택
4. 오른쪽 "새 규칙..." 클릭
5. 포트 → 다음
6. TCP, 특정 로컬 포트: `3000` → 다음
7. 연결 허용 → 다음
8. 모두 체크 → 다음
9. 이름: "Maltan Frontend" → 마침

### **Step 4: 다른 개발자 접속**

같은 Wi-Fi/LAN에 있는 다른 개발자가 브라우저에서:

```
http://192.168.1.100:3000
```

**또는 지도 테스트 페이지:**

```
http://192.168.1.100:3000/map-test
```

---

## 📍 **방법 2: 브리지 어댑터 사용 (권장)**

Ubuntu VM이 독립적인 IP를 받아 직접 접속 가능하게 설정합니다.

### **Step 1: VirtualBox 네트워크 설정 변경**

1. VirtualBox 관리자 → VM 선택 → 설정
2. 네트워크 → 어댑터 1
3. **다음에 연결됨:** `NAT` → `어댑터에 브리지`로 변경
4. **이름:** 실제 네트워크 어댑터 선택 (예: Wi-Fi 또는 이더넷)
5. 확인 → VM 재시작

### **Step 2: Ubuntu VM의 IP 확인**

VM 재시작 후 Ubuntu 터미널에서:

```bash
hostname -I
```

예상 출력:
```
192.168.1.50  # <- VM이 직접 받은 IP
```

### **Step 3: Docker 컨테이너 재시작**

```bash
cd ~/maltan-project/maltan_frontend
docker compose restart
```

### **Step 4: 다른 개발자 접속**

같은 네트워크의 다른 개발자가:

```
http://192.168.1.50:3000
```

**장점:**
- 호스트 PC의 방화벽 설정 불필요
- 포트 포워딩 설정 불필요
- VM이 독립적인 네트워크 노드처럼 작동

---

## 📍 **방법 3: 인터넷을 통한 외부 접속 (ngrok)**

전 세계 어디서든 인터넷을 통해 접속할 수 있게 합니다.

### **Step 1: ngrok 설치 (Windows 호스트에서)**

1. https://ngrok.com 접속 및 회원가입
2. https://ngrok.com/download 에서 Windows 버전 다운로드
3. 압축 해제 후 원하는 폴더에 배치 (예: `C:\ngrok\`)
4. 환경 변수 PATH에 추가 (선택사항)

### **Step 2: ngrok 인증**

ngrok 대시보드에서 Authtoken 복사 후:

```powershell
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

### **Step 3: 터널 생성**

```powershell
ngrok http 3000
```

### **Step 4: 생성된 URL 공유**

터미널 출력:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

다른 개발자에게 URL 공유:
```
https://abc123.ngrok.io
https://abc123.ngrok.io/map-test
```

**주의:**
- 무료 플랜은 2시간 세션 제한
- URL은 재시작할 때마다 변경됨
- 유료 플랜에서 고정 도메인 사용 가능

---

## 📍 **방법 4: 공유기 포트 포워딩 (고정 IP 필요)**

집이나 사무실에 고정 외부 IP가 있는 경우 사용합니다.

### **Step 1: 공유기 설정**

1. 공유기 관리자 페이지 접속 (예: http://192.168.1.1)
2. 포트 포워딩 / 가상 서버 설정
3. 규칙 추가:
   - **외부 포트:** 3000
   - **내부 IP:** 192.168.1.100 (호스트 PC)
   - **내부 포트:** 3000
   - **프로토콜:** TCP

### **Step 2: 외부 IP 확인**

```bash
curl ifconfig.me
```

또는 브라우저에서:
```
https://www.whatismyip.com
```

### **Step 3: 다른 개발자 접속**

```
http://YOUR_EXTERNAL_IP:3000
```

**주의:**
- 보안상 권장하지 않음 (HTTPS 없음)
- DDNS 서비스 사용 권장 (IP 변경 시)

---

## 🔍 **접속 테스트 체크리스트**

### **Ubuntu VM에서 확인:**

```bash
# 1. Docker 컨테이너 실행 중?
docker ps | grep maltan-frontend

# 2. 포트 리스닝 확인
sudo netstat -tlnp | grep :3000

# 3. 로컬 접속 테스트
curl http://localhost:3000

# 4. 컨테이너 로그 확인
docker compose logs frontend
```

### **Windows 호스트에서 확인:**

```powershell
# 1. 로컬 접속 테스트
curl http://localhost:3000

# 2. 포트 리스닝 확인
netstat -ano | findstr :3000

# 3. 방화벽 규칙 확인
netsh advfirewall firewall show rule name="Maltan Frontend 3000"
```

### **다른 PC/스마트폰에서 테스트:**

```
http://192.168.1.100:3000
```

---

## 🛠️ **문제 해결**

### **문제 1: 같은 네트워크에서 접속 안됨**

#### **체크리스트:**

1. **호스트 PC 방화벽 확인**
   ```powershell
   # PowerShell (관리자)
   netsh advfirewall firewall add rule name="Maltan Frontend 3000" dir=in action=allow protocol=TCP localport=3000
   ```

2. **VirtualBox 포트 포워딩 확인**
   - 호스트 IP는 비워두기
   - 호스트 포트: 3000
   - 게스트 포트: 3000

3. **Docker 컨테이너 상태 확인**
   ```bash
   docker ps
   docker compose logs frontend
   ```

4. **Ubuntu 방화벽 확인 (있다면)**
   ```bash
   sudo ufw status
   sudo ufw allow 3000/tcp
   ```

### **문제 2: 외부 인터넷에서 접속 안됨 (ngrok 사용 시)**

1. **ngrok 실행 중인가?**
   ```powershell
   # ngrok이 실행 중이어야 함
   ngrok http 3000
   ```

2. **생성된 URL 확인**
   - 터미널에 표시된 `https://xxxx.ngrok.io` 사용

3. **ngrok 무료 플랜 제한**
   - 세션 시간 제한 (2시간)
   - 동시 터널 제한 (1개)

### **문제 3: Docker 컨테이너가 계속 재시작됨**

```bash
# 로그 확인
docker compose logs frontend

# 일반적인 원인: nginx 설정 오류
# nginx.conf 확인
cat nginx.conf

# 컨테이너 재빌드
docker compose down
docker compose up -d --build
```

---

## 📊 **권장 방법 요약**

| 방법 | 사용 사례 | 난이도 | 보안 |
|------|----------|--------|------|
| **방법 1: LAN 접속 (NAT)** | 같은 사무실/집에서 테스트 | ⭐⭐ | ✅ 안전 |
| **방법 2: 브리지 어댑터** | 팀원이 같은 네트워크 사용 | ⭐ | ✅ 안전 |
| **방법 3: ngrok** | 원격 팀원, 클라이언트 데모 | ⭐⭐⭐ | ⚠️ 주의 |
| **방법 4: 포트 포워딩** | 고정 서버 운영 | ⭐⭐⭐⭐ | ❌ 위험 |

### **추천 시나리오:**

1. **팀원이 같은 사무실/집에 있는 경우:**
   - → **방법 2 (브리지 어댑터)** 권장

2. **원격 팀원에게 데모:**
   - → **방법 3 (ngrok)** 권장

3. **일시적인 테스트:**
   - → **방법 1 (NAT + 포트포워딩)** 권장

---

## 🎯 **빠른 설정 (복사용)**

### **브리지 어댑터 설정 (권장)**

```bash
# === Ubuntu에서 ===

# 1. VM 재시작 후 IP 확인
hostname -I
# 예: 192.168.1.50

# 2. Docker 재시작
cd ~/maltan-project/maltan_frontend
docker compose restart

# 3. 확인
docker ps
curl http://localhost:3000

# === 다른 개발자 ===
# 브라우저에서:
# http://192.168.1.50:3000
```

### **ngrok 사용 (원격 접속)**

```powershell
# === Windows 호스트에서 ===

# 1. ngrok 설치 및 인증 (최초 1회)
ngrok config add-authtoken YOUR_AUTH_TOKEN

# 2. 터널 생성
ngrok http 3000

# 3. 생성된 URL 공유
# 예: https://abc123.ngrok.io
```

---

## ✅ **최종 확인**

### **다른 개발자가 접속 성공 시:**

- ✅ 메인 페이지 표시: `http://YOUR_IP:3000`
- ✅ 지도 테스트 페이지: `http://YOUR_IP:3000/map-test`
- ✅ Google Maps 정상 로드
- ✅ 검색 기능 작동
- ✅ 네비게이션 메뉴 동작

---

## 🎉 **완료!**

이제 다른 개발자도 프론트엔드에 접속할 수 있습니다!

**다음 단계:**
- 백엔드 User Service 개발
- API 연동 테스트
- 프론트엔드-백엔드 통합

**문의사항:** 문제가 발생하면 위의 문제 해결 섹션을 참고하세요.
