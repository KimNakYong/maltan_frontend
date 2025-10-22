# Maltan Frontend

## 🎨 **기술 스택**

### **프레임워크**
- **React 18**: 사용자 인터페이스
- **TypeScript**: 타입 안전성
- **Material-UI**: UI 컴포넌트 라이브러리
- **Redux Toolkit**: 상태 관리

### **지도 API**
- **카카오맵 API**: 지도 표시 및 위치 서비스
- **네이버맵 API**: 대체 지도 서비스

### **빌드 도구**
- **Vite**: 빠른 빌드 도구
- **Docker**: 컨테이너화

## 🚀 **빠른 시작**

### **1. 의존성 설치**
```bash
npm install
```

### **2. 개발 서버 시작**
```bash
npm start
# 또는
npm run dev
```

### **3. 빌드**
```bash
npm run build
```

### **4. Docker 실행**
```bash
docker build -t maltan-frontend .
docker run -p 3000:3000 maltan-frontend
```

## 📁 **프로젝트 구조**

```
maltan-frontend/
├── src/
│   ├── components/          # 재사용 가능한 컴포넌트
│   │   ├── MapComponent.tsx
│   │   ├── PlaceCard.tsx
│   │   └── UserProfile.tsx
│   ├── pages/              # 페이지 컴포넌트
│   │   ├── HomePage.tsx
│   │   ├── PlaceDetail.tsx
│   │   └── CommunityPage.tsx
│   ├── services/           # API 서비스
│   │   ├── api.ts
│   │   └── auth.ts
│   ├── store/              # Redux 스토어
│   │   ├── index.ts
│   │   └── slices/
│   ├── utils/              # 유틸리티 함수
│   │   ├── constants.ts
│   │   └── helpers.ts
│   └── App.tsx
├── public/                 # 정적 파일
├── package.json
├── Dockerfile
├── nginx.conf
└── README.md
```

## 🔧 **개발 환경**

### **요구사항**
- **Node.js**: 18.x 이상
- **npm**: 8.x 이상
- **Docker**: 20.x 이상 (선택사항)

### **개발 도구**
- VS Code
- React Developer Tools
- Redux DevTools

## 🎯 **주요 기능**

### **1. 지도 기반 서비스**
- 사용자 위치 기반 주변 장소 표시
- 맛집, 관광지, 문화시설 검색
- 실시간 위치 추적

### **2. 장소 정보**
- 장소 상세 정보 표시
- 리뷰 및 평점 시스템
- 사진 갤러리

### **3. 커뮤니티**
- 지역별 게시판
- 댓글 및 좋아요 기능
- 실시간 알림

### **4. 사용자 관리**
- 회원가입/로그인
- 프로필 관리
- 관심 장소 저장

## 🛠️ **개발 워크플로우**

### **브랜치 전략**
```
main (메인 브랜치)
├── develop (개발 브랜치)
├── feature/user-login
├── feature/map-integration
├── feature/place-detail
├── feature/community-board
└── feature/notification
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

### **컴포넌트 개발**
```bash
# 새로운 컴포넌트 개발
git checkout -b feature/place-card
# 개발 작업...
git add src/components/PlaceCard.tsx
git commit -m "feat(components): implement PlaceCard component"
```

## 📚 **문서**

### **🎨 Components (컴포넌트)**
- [MapComponent](./docs/components/MapComponent.md)
- [PlaceCard](./docs/components/PlaceCard.md)
- [UserProfile](./docs/components/UserProfile.md)

### **📄 Pages (페이지)**
- [HomePage](./docs/pages/HomePage.md)
- [PlaceDetail](./docs/pages/PlaceDetail.md)
- [CommunityPage](./docs/pages/CommunityPage.md)

### **🔌 API (API 연동)**
- [API Integration](./docs/api/API_Integration.md)
- [State Management](./docs/api/State_Management.md)

## 🔍 **테스트**

### **단위 테스트**
```bash
# 테스트 실행
npm test

# 테스트 커버리지
npm run test:coverage
```

### **E2E 테스트**
```bash
# E2E 테스트 실행
npm run test:e2e
```

## 🚀 **배포**

### **Docker 배포**
```bash
# Docker 이미지 빌드
docker build -t maltan-frontend .

# 컨테이너 실행
docker run -p 3000:3000 maltan-frontend
```

### **정적 파일 배포**
```bash
# 빌드
npm run build

# 정적 파일 서빙
npx serve -s build -l 3000
```

## 🔧 **환경 변수**

### **개발 환경**
```bash
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_KAKAO_MAP_API_KEY=your_kakao_map_api_key
```

### **프로덕션 환경**
```bash
REACT_APP_API_BASE_URL=https://api.maltan.com
REACT_APP_KAKAO_MAP_API_KEY=your_production_api_key
```

## 🚨 **문제 해결**

### **일반적인 문제들**
1. **포트 충돌**: `netstat -tlnp | grep :3000`
2. **의존성 문제**: `rm -rf node_modules && npm install`
3. **빌드 실패**: `npm run build` 로그 확인

### **유용한 명령어**
```bash
# 의존성 재설치
npm install

# 캐시 클리어
npm start -- --reset-cache

# 빌드 최적화
npm run build -- --analyze
```

## 👥 **개발팀**

- **개발자 A**: 백엔드 API 연동
- **개발자 B**: 프론트엔드 UI/UX

## 📄 **라이선스**

MIT License

## 🤝 **기여하기**

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**우리동네 소개 서비스 프론트엔드를 개발하세요!** 🎨✨
