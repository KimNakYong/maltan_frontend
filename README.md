# Maltan Frontend - 우리동네 소개 서비스

React + TypeScript + Material-UI 기반의 프론트엔드 애플리케이션

## 🎨 **기술 스택**

### **프레임워크**
- **React 18**: 사용자 인터페이스
- **TypeScript**: 타입 안전성
- **Vite**: 빠른 빌드 도구
- **Material-UI (MUI)**: UI 컴포넌트 라이브러리

### **상태 관리**
- **Redux Toolkit**: 전역 상태 관리
- **React Query**: 서버 상태 관리

### **폼 관리**
- **React Hook Form**: 폼 유효성 검사

### **라우팅**
- **React Router v6**: 클라이언트 사이드 라우팅

### **HTTP 클라이언트**
- **Axios**: API 통신

### **UI/UX**
- **Emotion**: CSS-in-JS
- **React Hot Toast**: 토스트 알림
- **Date-fns**: 날짜 포맷팅

## 🚀 **빠른 시작**

### **1. 의존성 설치**
```bash
npm install
```

### **2. 환경 변수 설정**
`.env.development` 파일을 생성하고 아래 내용을 추가하세요:
```bash
VITE_API_BASE_URL=http://localhost:8080
VITE_KAKAO_MAP_API_KEY=your_kakao_map_api_key
VITE_ENV=development
```

### **3. 개발 서버 시작**
```bash
npm run dev
# 또는
npm start
```

브라우저에서 http://localhost:5173 으로 접속하세요.

### **4. 빌드**
```bash
npm run build
```

### **5. 프리뷰**
```bash
npm run preview
```

## 📁 **프로젝트 구조**

```
maltan-frontend/
├── src/
│   ├── components/          # 재사용 가능한 컴포넌트
│   │   ├── Layout.tsx      # 레이아웃 (헤더, 푸터)
│   │   └── PrivateRoute.tsx # 인증 라우트
│   ├── pages/              # 페이지 컴포넌트
│   │   ├── HomePage.tsx    # 홈 페이지
│   │   ├── LoginPage.tsx   # 로그인 페이지
│   │   ├── RegisterPage.tsx # 회원가입 페이지
│   │   ├── ProfilePage.tsx # 프로필 페이지
│   │   ├── PlaceDetailPage.tsx # 장소 상세
│   │   └── CommunityPage.tsx # 커뮤니티
│   ├── services/           # API 서비스
│   │   ├── api.ts          # Axios 인스턴스 설정
│   │   ├── authService.ts  # 인증 서비스
│   │   └── userService.ts  # 사용자 서비스
│   ├── store/              # Redux 스토어
│   │   ├── index.ts        # 스토어 설정
│   │   ├── hooks.ts        # 타입 지정된 Hooks
│   │   └── slices/         # Redux Slices
│   │       ├── authSlice.ts    # 인증 상태
│   │       └── userSlice.ts    # 사용자 상태
│   ├── utils/              # 유틸리티 함수
│   │   ├── constants.ts    # 상수 정의
│   │   └── helpers.ts      # 헬퍼 함수
│   ├── App.tsx             # 메인 앱 컴포넌트
│   ├── main.tsx            # 엔트리 포인트
│   ├── index.css           # 글로벌 스타일
│   └── vite-env.d.ts       # 타입 정의
├── public/                 # 정적 파일
├── index.html              # HTML 템플릿
├── package.json            # 의존성 관리
├── tsconfig.json           # TypeScript 설정
├── vite.config.ts          # Vite 설정
└── README.md               # 이 파일
```

## 🎯 **주요 기능**

### **✅ 구현 완료**
- [x] 회원가입/로그인
- [x] 프로필 관리
- [x] JWT 기반 인증
- [x] 토큰 자동 갱신
- [x] Private Route 보호
- [x] 반응형 디자인
- [x] 에러 핸들링
- [x] 토스트 알림

### **🚧 개발 예정**
- [ ] 지도 기반 서비스 (카카오맵 연동)
- [ ] 장소 검색 및 상세 정보
- [ ] 리뷰 작성 및 평점
- [ ] 커뮤니티 게시판
- [ ] 실시간 알림
- [ ] 좋아요 및 북마크

## 🔧 **개발 환경**

### **요구사항**
- **Node.js**: 18.x 이상
- **npm**: 8.x 이상

### **권장 도구**
- **VS Code**: 코드 에디터
- **React Developer Tools**: 브라우저 확장
- **Redux DevTools**: 브라우저 확장

## 🛠️ **개발 워크플로우**

### **브랜치 전략**
```
main (메인 브랜치)
└── develop (개발 브랜치)
```

### **커밋 규칙**
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 스타일 변경
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 빌드/설정 변경
```

### **예시**
```bash
# 변경사항 확인
git status

# 파일 추가
git add src/pages/LoginPage.tsx

# 커밋
git commit -m "feat(auth): implement login page"

# 푸시
git push origin develop
```

## 📚 **API 연동**

### **기본 설정**
```typescript
// .env.development
VITE_API_BASE_URL=http://localhost:8080
```

### **사용 예시**
```typescript
import authService from './services/authService';

// 로그인
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123',
});

// 회원가입
const response = await authService.register({
  email: 'user@example.com',
  password: 'password123',
  username: '홍길동',
  address: '서울시 강남구',
});
```

## 🔑 **인증 시스템**

### **JWT 토큰 관리**
- **Access Token**: API 요청 시 자동으로 헤더에 추가
- **Refresh Token**: Access Token 만료 시 자동 갱신
- **로컬 스토리지**: 토큰 및 사용자 정보 저장

### **보호된 라우트**
```typescript
<Route
  path="/profile"
  element={
    <PrivateRoute>
      <ProfilePage />
    </PrivateRoute>
  }
/>
```

## 🎨 **테마 커스터마이징**

Material-UI 테마는 `App.tsx`에서 설정:

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});
```

## 🚨 **문제 해결**

### **일반적인 문제들**

1. **포트 충돌**
```bash
# Vite 기본 포트: 5173
# 다른 포트 사용
npm run dev -- --port 3000
```

2. **의존성 문제**
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

3. **타입 에러**
```bash
# TypeScript 타입 체크
npm run type-check
```

## 📝 **스크립트**

```json
{
  "dev": "vite",                    // 개발 서버 시작
  "build": "tsc && vite build",     // 프로덕션 빌드
  "preview": "vite preview",        // 빌드 프리뷰
  "test": "vitest",                 // 테스트 실행
  "lint": "eslint .",               // 린트 검사
  "lint:fix": "eslint . --fix",     // 린트 자동 수정
  "type-check": "tsc --noEmit"      // 타입 체크만
}
```

## 🌐 **배포**

### **Docker 배포**
```bash
# Docker 이미지 빌드
docker build -t maltan-frontend .

# 컨테이너 실행
docker run -p 3000:3000 maltan-frontend
```

### **정적 호스팅**
```bash
# 빌드
npm run build

# dist 폴더를 정적 호스팅 서비스에 업로드
# (예: Vercel, Netlify, GitHub Pages)
```

## 👥 **개발팀**

- **개발자 A**: 백엔드 API 연동
- **개발자 B**: 프론트엔드 UI/UX

## 📄 **라이선스**

MIT License

## 🤝 **기여하기**

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**우리동네 소개 서비스 프론트엔드** 🎨✨
