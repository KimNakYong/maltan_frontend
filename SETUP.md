# 프론트엔드 개발 환경 설정 가이드

## 📋 **개요**

이 문서는 유저 서비스 테스트를 위한 프론트엔드 개발 환경 설정 방법을 안내합니다.

## 🚀 **빠른 시작**

### **1. 의존성 설치**

```bash
cd F:\3project\maltan-frontend
npm install
```

### **2. 환경 변수 설정**

`.env.development` 파일이 이미 생성되어 있습니다. 필요시 수정하세요:

```bash
VITE_API_BASE_URL=http://localhost:8080
VITE_KAKAO_MAP_API_KEY=your_kakao_map_api_key
VITE_ENV=development
```

### **3. 개발 서버 시작**

```bash
npm run dev
```

브라우저에서 http://localhost:5173 으로 접속하세요.

## ✅ **구현된 기능**

### **1. 인증 시스템**
- ✅ 로그인 (`/login`)
- ✅ 회원가입 (`/register`)
- ✅ 로그아웃
- ✅ JWT 토큰 관리
- ✅ 자동 토큰 갱신

### **2. 사용자 관리**
- ✅ 프로필 조회 (`/profile`)
- ✅ 프로필 수정
- ✅ 비밀번호 변경

### **3. 레이아웃**
- ✅ 헤더 (로고, 메뉴, 사용자 정보)
- ✅ 푸터
- ✅ Private Route (인증 필요)

### **4. UI/UX**
- ✅ Material-UI 컴포넌트
- ✅ 반응형 디자인
- ✅ 토스트 알림
- ✅ 로딩 스피너
- ✅ 에러 처리

## 📁 **주요 파일 구조**

```
src/
├── components/
│   ├── Layout.tsx          # 레이아웃 (헤더, 푸터)
│   └── PrivateRoute.tsx    # 인증 라우트
├── pages/
│   ├── HomePage.tsx        # 홈 페이지
│   ├── LoginPage.tsx       # 로그인 페이지
│   ├── RegisterPage.tsx    # 회원가입 페이지
│   └── ProfilePage.tsx     # 프로필 페이지
├── services/
│   ├── api.ts              # Axios 설정 + 인터셉터
│   ├── authService.ts      # 인증 API
│   └── userService.ts      # 사용자 API
├── store/
│   ├── index.ts            # Redux 스토어
│   ├── hooks.ts            # 타입 지정된 Hooks
│   └── slices/
│       ├── authSlice.ts    # 인증 상태 관리
│       └── userSlice.ts    # 사용자 상태 관리
├── utils/
│   ├── constants.ts        # 상수 (API 엔드포인트, 유효성 검사 규칙 등)
│   └── helpers.ts          # 헬퍼 함수
├── App.tsx                 # 메인 앱
└── main.tsx                # 엔트리 포인트
```

## 🧪 **테스트 시나리오**

### **시나리오 1: 회원가입 및 로그인**

1. **회원가입**
   - http://localhost:5173/register 접속
   - 이메일, 비밀번호, 이름, 주소 입력
   - "회원가입" 버튼 클릭
   - ✅ 성공 시: 자동 로그인 후 홈으로 이동

2. **로그인**
   - http://localhost:5173/login 접속
   - 이메일, 비밀번호 입력
   - "로그인" 버튼 클릭
   - ✅ 성공 시: 홈으로 이동

### **시나리오 2: 프로필 관리**

1. **프로필 조회**
   - 로그인 후 헤더의 프로필 아이콘 클릭
   - "프로필" 메뉴 선택
   - ✅ 성공 시: 현재 사용자 정보 표시

2. **프로필 수정**
   - 이름, 주소, 전화번호 수정
   - "저장" 버튼 클릭
   - ✅ 성공 시: "프로필이 업데이트되었습니다" 토스트 표시

3. **비밀번호 변경**
   - "비밀번호 변경" 버튼 클릭
   - 현재 비밀번호, 새 비밀번호 입력
   - "변경" 버튼 클릭
   - ✅ 성공 시: "비밀번호가 변경되었습니다" 토스트 표시

### **시나리오 3: 로그아웃**

1. 헤더의 프로필 아이콘 클릭
2. "로그아웃" 메뉴 선택
3. ✅ 성공 시: 로그인 페이지로 이동

## 🔌 **백엔드 API 연동**

### **API 엔드포인트 (예상)**

```typescript
// 인증
POST /api/user/auth/login         // 로그인
POST /api/user/auth/register      // 회원가입
POST /api/user/auth/logout        // 로그아웃
POST /api/user/auth/refresh       // 토큰 갱신
GET  /api/user/auth/me            // 현재 사용자 정보

// 사용자
GET  /api/user/profile            // 프로필 조회
PUT  /api/user/profile            // 프로필 수정
POST /api/user/password           // 비밀번호 변경
DELETE /api/user/account          // 회원 탈퇴
```

### **요청 예시**

#### **로그인**
```bash
curl -X POST http://localhost:8080/api/user/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**응답:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "username": "홍길동",
    "address": "서울시 강남구",
    "phone": "010-1234-5678",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### **회원가입**
```bash
curl -X POST http://localhost:8080/api/user/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "username": "홍길동",
    "address": "서울시 강남구",
    "phone": "010-1234-5678"
  }'
```

## 🔧 **개발 팁**

### **1. Redux DevTools 사용**

브라우저에서 Redux DevTools를 열어 상태 변화를 확인할 수 있습니다:
- Chrome: F12 → Redux 탭
- 액션, 상태 변화, 타임 트래블 디버깅 가능

### **2. React Query DevTools**

React Query의 캐시 상태를 확인할 수 있습니다:
- 개발 서버 실행 시 자동으로 화면 하단에 표시됨

### **3. 토스트 메시지 커스터마이징**

`src/utils/constants.ts`에서 토스트 메시지 수정:
```typescript
export const TOAST_MESSAGES = {
  SUCCESS: {
    LOGIN: '로그인에 성공했습니다.',
    // ...
  },
  ERROR: {
    LOGIN: '로그인에 실패했습니다.',
    // ...
  },
};
```

### **4. API 엔드포인트 수정**

백엔드 API 경로가 다를 경우 `src/utils/constants.ts` 수정:
```typescript
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/user/auth/login',    // 수정 가능
    REGISTER: '/api/user/auth/register',
    // ...
  },
};
```

## 🚨 **문제 해결**

### **1. CORS 에러**

```
Access to XMLHttpRequest at 'http://localhost:8080/api/...' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**해결 방법:**
백엔드에서 CORS 설정 필요:
```java
// Spring Boot 예시
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("*")
                .allowCredentials(true);
    }
}
```

### **2. 401 Unauthorized**

**원인:** Access Token이 만료되었거나 유효하지 않음

**자동 처리:**
- `src/services/api.ts`의 Response Interceptor가 자동으로 토큰 갱신 시도
- 갱신 실패 시 로그인 페이지로 리다이렉트

### **3. 네트워크 에러**

```
Network Error
```

**확인 사항:**
1. 백엔드 서버가 실행 중인가? (`http://localhost:8080`)
2. `.env.development`의 `VITE_API_BASE_URL`이 올바른가?
3. 방화벽이 8080 포트를 차단하고 있지 않은가?

### **4. 의존성 설치 실패**

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install

# 또는 캐시 클리어
npm cache clean --force
npm install
```

## 📝 **다음 단계**

프론트엔드가 준비되었습니다! 이제 백엔드 유저 서비스를 개발하면 됩니다:

1. **백엔드 User Service 개발**
   - Spring Boot 프로젝트 생성
   - User Entity, Repository, Service, Controller 구현
   - JWT 인증 구현
   - API 엔드포인트 구현

2. **통합 테스트**
   - 프론트엔드 + 백엔드 연동 테스트
   - 회원가입, 로그인, 프로필 관리 기능 검증

3. **Docker 배포**
   - 프론트엔드 Docker 이미지 빌드
   - 백엔드 Docker 이미지 빌드
   - Docker Compose로 통합 실행

## 🎉 **완료!**

프론트엔드 개발 환경이 모두 준비되었습니다. 이제 백엔드 개발을 시작하세요!

```bash
# 프론트엔드 실행
cd F:\3project\maltan-frontend
npm run dev

# 브라우저에서 확인
# http://localhost:5173
```

