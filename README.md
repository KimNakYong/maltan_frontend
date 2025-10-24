# Maltan Frontend

지역 기반 커뮤니티 플랫폼 - 프론트엔드

## 🚀 기술 스택

- **React 18** + **TypeScript**
- **Vite** - 빌드 도구
- **Material-UI (MUI)** - UI 컴포넌트
- **Redux Toolkit** - 상태 관리
- **React Router** - 라우팅
- **React Query** - 서버 상태 관리
- **Axios** - HTTP 클라이언트
- **Google Maps API** - 지도 기능

## 📁 프로젝트 구조

```
maltan-frontend/
├── src/
│   ├── components/        # 재사용 가능한 컴포넌트
│   ├── pages/            # 페이지 컴포넌트
│   │   ├── admin/        # 관리자 페이지
│   │   ├── CommunityPage.tsx
│   │   ├── CommunityDetailPage.tsx
│   │   └── ...
│   ├── services/         # API 서비스
│   ├── store/            # Redux 스토어
│   ├── hooks/            # 커스텀 훅
│   ├── utils/            # 유틸리티 함수
│   └── types/            # TypeScript 타입 정의
├── docs/                 # 문서
│   └── DEPLOYMENT_GUIDE.md
├── scripts/              # 배포 스크립트
│   └── setup-server.sh
└── .github/
    └── workflows/
        └── deploy.yml    # GitHub Actions CI/CD

```

## 🛠️ 로컬 개발 환경 설정

### 1. 환경 변수 설정

`.env` 파일 생성:

```env
VITE_API_URL=http://localhost:8080/api
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 4. 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

## 📦 주요 기능

### 사용자 기능
- ✅ 회원가입/로그인 (JWT 인증)
- ✅ 지역 기반 장소 검색
- ✅ 커뮤니티 게시판
  - 게시글 작성/수정/삭제
  - 댓글 작성
  - 추천/비추천
  - 모임 인원 모집
- ✅ Google Maps 연동
- ✅ 지역별 필터링

### 관리자 기능
- ✅ 대시보드 (시스템 모니터링)
- ✅ 사용자 관리
- ✅ 게시글/장소 관리
- ✅ 통계 및 로그 조회

## 🚀 자동 배포

### GitHub Actions CI/CD

`main` 브랜치에 push하면 자동으로 Ubuntu 서버에 배포됩니다.

**배포 프로세스:**
1. 코드 체크아웃
2. Node.js 설정
3. 의존성 설치 (`npm ci`)
4. 환경 변수 파일 생성
5. 빌드 (`npm run build`)
6. Nginx에 배포 (`/var/www/maltan-frontend`)
7. Nginx 리로드

**자세한 내용:** [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)

## 🔗 API 연동

백엔드 API는 Gateway Service를 통해 접근합니다:

```typescript
// src/services/api.ts
const API_URL = import.meta.env.VITE_API_URL; // http://localhost:8080/api
```

### 주요 API 서비스
- `authService.ts` - 인증/사용자 관리
- `communityService.ts` - 커뮤니티 기능
- `userService.ts` - 사용자 프로필

## 📱 주요 페이지

| 경로 | 컴포넌트 | 설명 |
|------|---------|------|
| `/` | HomePage | 메인 페이지 |
| `/login` | LoginPage | 로그인 |
| `/register` | RegisterPage | 회원가입 |
| `/community` | CommunityPage | 커뮤니티 목록 |
| `/community/write` | CommunityWritePage | 글쓰기 |
| `/community/:id` | CommunityDetailPage | 게시글 상세 |
| `/profile` | ProfilePage | 프로필 |
| `/admin/*` | Admin Pages | 관리자 페이지 |

## 🧪 테스트

```bash
# 테스트 실행
npm test

# 린트 체크
npm run lint
```

## 📚 문서

- [배포 가이드](docs/DEPLOYMENT_GUIDE.md) - 자동 배포 설정 및 운영 가이드

## 🤝 Contributing

1. Feature 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
2. 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
3. 브랜치에 Push (`git push origin feature/AmazingFeature`)
4. Pull Request 생성

## 📝 License

이 프로젝트는 MIT 라이센스를 따릅니다.

## 👥 팀

Maltan Project Team

---

**Made with ❤️ by Maltan Team**
