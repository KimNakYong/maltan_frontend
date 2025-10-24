# ngrok 설치 및 사용 가이드

## 🌐 **ngrok이란?**

로컬 서버를 인터넷에 공개하여 전 세계 어디서든 접속할 수 있게 해주는 터널링 서비스입니다.

**사용 케이스:**
- 다른 네트워크에 있는 개발자와 협업
- 클라이언트에게 데모 시연
- 모바일 기기에서 테스트
- 원격 팀원과 개발 공유

---

## 📥 **1. ngrok 설치**

### **방법 1: 공식 사이트에서 다운로드 (권장)**

1. **회원가입**
   - https://ngrok.com 접속
   - 무료 회원가입 (Google/GitHub 계정으로 가능)

2. **다운로드**
   - https://dashboard.ngrok.com/get-started/setup
   - **Windows (64-bit)** 다운로드

3. **설치**
   - 다운로드한 ZIP 파일 압축 해제
   - `ngrok.exe`를 원하는 폴더에 배치
   - 예: `C:\ngrok\ngrok.exe`

4. **PATH 환경 변수 추가 (선택사항)**
   - Windows 검색 → "환경 변수"
   - 시스템 환경 변수 → Path 편집
   - 새로 만들기 → `C:\ngrok` 추가

---

## 🔑 **2. ngrok 인증**

### **인증 토큰 받기**

1. https://dashboard.ngrok.com/get-started/your-authtoken 접속
2. 인증 토큰(Authtoken) 복사

### **인증 토큰 설정**

**CMD 또는 PowerShell에서:**

```bash
# ngrok.exe가 있는 폴더로 이동 (PATH 설정 안 한 경우)
cd C:\ngrok

# 인증 토큰 설정
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

**예시:**
```bash
ngrok config add-authtoken 2abc123def456_1234567890ABCDEFGHIJKLMNOP
```

**성공 메시지:**
```
Authtoken saved to configuration file: C:\Users\YourName\.ngrok2\ngrok.yml
```

---

## 🚀 **3. ngrok 실행**

### **기본 사용법**

```bash
# 3000 포트를 인터넷에 공개
ngrok http 3000
```

### **실행 화면**

```
ngrok                                                                  

Session Status                online
Account                       your_email@example.com (Plan: Free)
Version                       3.3.5
Region                        United States (us)
Latency                       50ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123def456.ngrok-free.app -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

### **중요 정보**

- **Forwarding URL**: `https://abc123def456.ngrok-free.app`
  - 이 URL을 다른 개발자에게 공유!
- **Web Interface**: `http://127.0.0.1:4040`
  - 실시간 요청/응답 모니터링

---

## 🌐 **4. 다른 개발자 접속**

### **공유할 URL**

ngrok 실행 화면에서 `Forwarding` 줄의 HTTPS URL을 복사:

```
https://abc123def456.ngrok-free.app
```

### **접속 방법**

다른 개발자가 브라우저에서:

```
https://abc123def456.ngrok-free.app
```

**지도 테스트 페이지:**
```
https://abc123def456.ngrok-free.app/map-test
```

---

## 📊 **5. 모니터링**

### **ngrok Web Interface**

브라우저에서:
```
http://127.0.0.1:4040
```

**기능:**
- 실시간 HTTP 요청/응답 확인
- 요청 재전송 (Replay)
- 상세 로그

---

## ⚠️ **6. 주의사항 및 제한**

### **무료 플랜 제한**

| 항목 | 제한 |
|------|------|
| 세션 시간 | 2시간 (재시작 필요) |
| 동시 터널 | 1개 |
| URL | 재시작 시마다 변경 |
| 대역폭 | 제한 있음 |
| 커스텀 도메인 | ❌ 불가 |

### **유료 플랜 ($8/월)**

- ✅ 무제한 세션
- ✅ 고정 도메인 (예: `myapp.ngrok.io`)
- ✅ 커스텀 도메인
- ✅ IP 화이트리스트

---

## 🔄 **7. 사용 예시**

### **시나리오 1: 팀원에게 공유**

```bash
# Windows (호스트 PC)
cd C:\ngrok
ngrok http 3000
```

**출력:**
```
Forwarding   https://abc123.ngrok-free.app -> http://localhost:3000
```

**팀원에게 공유:**
```
안녕하세요! 프론트엔드 테스트 서버 주소입니다:
https://abc123.ngrok-free.app
```

### **시나리오 2: 클라이언트 데모**

```bash
ngrok http 3000 --region=ap
```
- `--region=ap`: 아시아-태평양 서버 사용 (더 빠른 속도)

### **시나리오 3: 사용자 정의 서브도메인 (유료)**

```bash
ngrok http 3000 --subdomain=maltan-demo
```
- URL: `https://maltan-demo.ngrok.io`

---

## 🛠️ **8. 문제 해결**

### **문제 1: "ERR_NGROK_108"**

**증상:**
```
ERR_NGROK_108: You've hit your account limit for simultaneous ngrok agent sessions.
```

**해결:**
- 다른 ngrok 프로세스 종료
- 무료 플랜은 동시 1개만 가능

### **문제 2: "authentication failed"**

**증상:**
```
ERROR:  authentication failed
```

**해결:**
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

### **문제 3: 접속이 느림**

**해결:**
- 가까운 리전 사용
```bash
ngrok http 3000 --region=ap  # 아시아
ngrok http 3000 --region=us  # 미국
ngrok http 3000 --region=eu  # 유럽
```

### **문제 4: "tunnel not found"**

**증상:**
- URL 접속 시 "Tunnel not found" 에러

**해결:**
- ngrok이 실행 중인지 확인
- 올바른 포트 사용 중인지 확인

---

## 🎯 **9. 빠른 시작 (복사용)**

### **최초 설정 (1회만)**

```bash
# 1. ngrok 다운로드
# https://ngrok.com/download

# 2. 압축 해제 및 폴더 이동
cd C:\ngrok

# 3. 인증 토큰 설정
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

### **이후 사용**

```bash
# ngrok 폴더로 이동
cd C:\ngrok

# 터널 시작
ngrok http 3000
```

### **다른 개발자에게 공유**

```
프론트엔드 테스트 서버:
https://[생성된-URL].ngrok-free.app

지도 테스트:
https://[생성된-URL].ngrok-free.app/map-test
```

---

## 📱 **10. 대안: ngrok Desktop App**

### **GUI 버전 사용**

1. https://ngrok.com/download 에서 "ngrok Desktop" 다운로드
2. 설치 및 로그인
3. 포트 `3000` 입력
4. "Start" 클릭

**장점:**
- GUI로 쉽게 사용
- 설정 저장
- 여러 터널 관리

---

## ✅ **완료!**

이제 ngrok을 사용하여 전 세계 어디서든 프론트엔드에 접속할 수 있습니다!

### **다음 단계:**

1. ✅ ngrok 설치 및 인증
2. ✅ `ngrok http 3000` 실행
3. ✅ 생성된 URL 공유
4. ✅ 다른 개발자 접속 확인

**팁:** ngrok을 백그라운드로 실행하려면 새 터미널 창에서 실행하세요!


