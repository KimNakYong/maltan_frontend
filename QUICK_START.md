# 프론트엔드 빠른 시작 가이드

## 🚀 **Docker로 바로 실행하기**

### **Windows에서 실행**

#### **방법 1: 배치 파일 사용 (가장 쉬움!)**

1. **빌드**
   ```
   더블클릭: docker-build.bat
   ```

2. **실행**
   ```
   더블클릭: docker-run.bat
   ```

3. **로그 확인**
   ```
   더블클릭: docker-logs.bat
   ```

4. **중지**
   ```
   더블클릭: docker-stop.bat
   ```

5. **브라우저에서 확인**
   ```
   http://localhost:3000
   ```

---

#### **방법 2: 명령어 사용**

PowerShell 또는 CMD를 열고:

```bash
# 1. 프론트엔드 폴더로 이동
cd F:\3project\maltan-frontend

# 2. Docker Compose로 실행
docker-compose up -d

# 3. 로그 확인
docker-compose logs -f frontend

# 4. 브라우저에서 확인
# http://localhost:3000

# 5. 중지
docker-compose down
```

---

## 🔧 **Ubuntu 서버에서 실행**

### **1단계: 파일 전송 (Git 사용)**

```bash
# Ubuntu SSH 접속
ssh username@localhost -p 2222

# Git clone
cd ~
git clone https://github.com/KimNakYong/maltan_frontend.git
cd maltan_frontend
```

### **2단계: Docker 실행**

```bash
# Docker Compose로 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f frontend
```

### **3단계: 포트 포워딩**

VirtualBox에서 포트 포워딩 설정:
- 이름: frontend
- 프로토콜: TCP
- 호스트 포트: 3000
- 게스트 포트: 3000

### **4단계: Windows에서 접속**

```
http://localhost:3000
```

---

## 📝 **테스트 시나리오**

### **1. 홈 페이지 확인**
- http://localhost:3000 접속
- 메인 페이지가 정상적으로 표시되는지 확인

### **2. 회원가입**
- "회원가입" 버튼 클릭
- 이메일, 비밀번호, 이름, 주소 입력
- 회원가입 완료

### **3. 로그인**
- "로그인" 버튼 클릭
- 이메일, 비밀번호 입력
- 로그인 완료

### **4. 프로필 관리**
- 헤더의 프로필 아이콘 클릭
- "프로필" 메뉴 선택
- 정보 수정 및 저장

---

## ⚠️ **주의사항**

### **백엔드 API가 없는 경우**

현재는 프론트엔드만 실행된 상태입니다. 
백엔드 API가 아직 없으므로:

- ✅ 화면은 정상적으로 표시됨
- ❌ 로그인/회원가입은 실패함 (백엔드 API 없음)
- ❌ 프로필 조회는 실패함 (백엔드 API 없음)

**해결 방법:**
백엔드 User Service를 개발하고 실행하면 모든 기능이 작동합니다.

---

## 🔍 **문제 해결**

### **1. 포트 충돌**
```bash
# 3000 포트 사용 중인 프로세스 종료
netstat -ano | findstr :3000
# PID 확인 후 작업 관리자에서 종료
```

### **2. Docker가 실행되지 않음**
```bash
# Docker Desktop 실행 확인
# Docker Desktop을 시작하세요
```

### **3. 빌드 실패**
```bash
# 캐시 없이 재빌드
docker-compose build --no-cache
```

---

## 📊 **다음 단계**

1. **백엔드 User Service 개발**
   - Spring Boot 프로젝트 생성
   - JWT 인증 구현
   - User CRUD API 구현

2. **전체 MSA 통합**
   - 백엔드 + 프론트엔드 Docker Compose 통합
   - 모든 서비스 동시 실행

3. **테스트**
   - 회원가입, 로그인, 프로필 관리 테스트
   - API 연동 확인

---

## 🎉 **완료!**

프론트엔드가 Docker에서 실행 중입니다!

```
✅ 빌드: docker-build.bat
✅ 실행: docker-run.bat
✅ 확인: http://localhost:3000
✅ 로그: docker-logs.bat
✅ 중지: docker-stop.bat
```

