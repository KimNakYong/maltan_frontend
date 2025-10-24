# 관리자 페이지 가이드

## 📊 개요

관리자 페이지는 시스템 모니터링, 사용자 관리, 통계 분석 등 서비스 운영에 필요한 모든 기능을 제공합니다.

---

## 🔐 접근 방법

### 1. 관리자 권한 필요
- `User.role`이 `ADMIN`인 사용자만 접근 가능
- 일반 사용자가 접근 시 "접근 권한 없음" 메시지 표시

### 2. 접속 URL
```
http://localhost:3000/admin
또는
http://localhost:3000/admin/dashboard
```

### 3. 테스트용 관리자 계정 생성 (백엔드 개발 시)
```java
// User 엔티티 생성 시
User admin = User.builder()
    .email("admin@example.com")
    .password(passwordEncoder.encode("admin123"))
    .username("관리자")
    .role("ADMIN")  // 중요!
    .build();
```

---

## 📑 페이지 구성

### 1. 대시보드 (`/admin/dashboard`)
**실시간 모니터링 및 시스템 상태 확인**

#### 주요 기능
- **주요 통계 카드**
  - 총 사용자 수 (전월 대비 증감률)
  - 활성 사용자 수
  - 등록된 장소 수
  - 커뮤니티 글 수

- **시스템 리소스 모니터링**
  - CPU 사용률 (50% 미만: 정상, 50~80%: 경고, 80% 이상: 위험)
  - 메모리 사용률
  - 디스크 사용률
  - 네트워크 사용률

- **트래픽 차트**
  - API 요청 추이 (시간대별)
  - 에러 발생 추이
  - 서비스별 응답 시간

- **서비스 상태 테이블**
  - 각 마이크로서비스 상태 (정상/경고)
  - 가동률 (Uptime)
  - 평균 응답시간

- **최근 에러 로그**
  - 최근 발생한 에러 목록
  - 에러 레벨 (INFO/WARNING/ERROR)
  - 발생 시간

#### 데이터 갱신
- 30초마다 자동 새로고침
- 마지막 업데이트 시간 표시

---

### 2. 사용자 관리 (`/admin/users`)
**사용자 계정 관리 및 권한 설정**

#### 주요 기능
- **사용자 목록**
  - 페이지네이션 (5/10/25/50개씩)
  - 이름/이메일 검색
  - 사용자 정보 (이름, 이메일, 권한, 상태, 가입일, 마지막 로그인)

- **사용자 작업**
  - ✏️ **편집**: 사용자 상세 정보 보기/수정
  - 👑 **관리자 권한 토글**: USER ↔ ADMIN 전환
  - 🚫 **차단**: 사용자 계정 차단/해제
  - 🗑️ **삭제**: 사용자 계정 영구 삭제 (확인 필요)

- **사용자 상세 다이얼로그**
  - 프로필 정보
  - 관심 지역 (우선순위별)
  - 가입일 및 마지막 로그인 시간
  - 수정 버튼

#### API 연동 필요
```typescript
// GET /api/admin/users
// POST /api/admin/users/:id/block
// POST /api/admin/users/:id/toggle-admin
// DELETE /api/admin/users/:id
```

---

### 3. 통계 (`/admin/statistics`)
**서비스 사용 통계 및 분석**

#### 주요 기능
- **기간 선택**
  - 일간/주간/월간/연간
  - 지역별 필터링

- **주요 지표**
  - 총 사용자 (전월 대비 증감률)
  - 활성 사용자 (MAU - Monthly Active Users)
  - 등록된 장소
  - 커뮤니티 글

- **차트**
  - 📈 **사용자 증가 추이**: 월별 총 사용자 및 활성 사용자
  - 🥧 **카테고리별 장소 분포**: 음식점, 카페, 관광지 등
  - 📊 **지역별 분포**: 사용자 및 장소 수 (구별)
  - ⏰ **시간대별 활동량**: 시간대별 API 요청 수

- **상세 통계**
  - 평균 세션 시간
  - 페이지뷰 (일평균)
  - 이탈률
  - 신규 방문자 비율

---

### 4. 로그 (`/admin/logs`)
**시스템 로그 조회 및 분석**

#### 주요 기능
- **필터링**
  - 로그 레벨: ERROR / WARNING / INFO / DEBUG
  - 서비스: User / Place / Community / Recommendation / Gateway
  - 검색: 로그 메시지 또는 서비스명

- **로그 테이블**
  - 시간 (정렬 가능)
  - 레벨 (색상 구분)
  - 서비스
  - 메시지
  - 사용자 ID (해당하는 경우)

- **페이지네이션**
  - 10/25/50/100개씩 표시

#### API 연동 필요
```typescript
// GET /api/admin/logs?level=ERROR&service=User&page=1&limit=25
```

---

### 5. 장소 관리 (`/admin/places`)
**등록된 장소 관리 (개발 예정)**

#### 계획된 기능
- 장소 목록 조회
- 승인 대기 장소 관리
- 장소 정보 수정/삭제
- 카테고리 관리

---

### 6. 커뮤니티 관리 (`/admin/community`)
**커뮤니티 게시글 및 댓글 관리 (개발 예정)**

#### 계획된 기능
- 게시글 목록 조회
- 신고된 게시글 처리
- 댓글 관리
- 게시글/댓글 삭제

---

### 7. 설정 (`/admin/settings`)
**시스템 환경 설정 (개발 예정)**

#### 계획된 기능
- 시스템 환경 변수 설정
- 알림 설정
- 백업 관리
- 유지보수 모드

---

## 🎨 UI/UX 특징

### 레이아웃
- **사이드바 네비게이션**: 모든 관리 기능에 빠르게 접근
- **반응형 디자인**: 모바일/태블릿에서도 사용 가능
- **다크 모드 지원**: (추후 추가 예정)

### 색상 코드
- **정상 (Success)**: 녹색 - 정상 작동 중
- **경고 (Warning)**: 주황색 - 주의 필요
- **에러 (Error)**: 빨간색 - 즉시 조치 필요
- **정보 (Info)**: 파란색 - 일반 정보

### 아이콘
- 📊 대시보드
- 👥 사용자 관리
- 📍 장소 관리
- 💬 커뮤니티 관리
- 📈 통계
- 📄 로그
- ⚙️ 설정

---

## 🔧 백엔드 API 요구사항

### 1. 대시보드 API
```typescript
// GET /api/admin/dashboard/metrics
{
  stats: {
    totalUsers: number;
    activeUsers: number;
    totalPlaces: number;
    totalPosts: number;
    usersChange: number;  // 전월 대비 %
    placesChange: number;
    postsChange: number;
  },
  system: {
    cpu: number;  // 0-100
    memory: number;
    disk: number;
    network: number;
  },
  traffic: Array<{
    time: string;
    requests: number;
    errors: number;
  }>,
  services: Array<{
    name: string;
    status: 'healthy' | 'warning' | 'error';
    uptime: string;
    responseTime: string;
  }>,
  recentErrors: Array<{
    time: string;
    service: string;
    error: string;
    level: 'info' | 'warning' | 'error';
  }>
}
```

### 2. 사용자 관리 API
```typescript
// GET /api/admin/users?page=1&limit=10&search=keyword
{
  users: Array<{
    id: string;
    username: string;
    email: string;
    role: 'USER' | 'ADMIN';
    status: 'active' | 'blocked';
    preferredRegions: Array<{
      cityName: string;
      districtName: string;
      priority: number;
    }>;
    createdAt: string;
    lastLoginAt: string;
  }>,
  total: number;
  page: number;
  limit: number;
}

// POST /api/admin/users/:id/block
// POST /api/admin/users/:id/toggle-admin
// DELETE /api/admin/users/:id
```

### 3. 통계 API
```typescript
// GET /api/admin/statistics?period=month&region=all
{
  summary: {
    totalUsers: number;
    activeUsers: number;
    totalPlaces: number;
    totalPosts: number;
  },
  userGrowth: Array<{
    period: string;
    users: number;
    active: number;
  }>,
  placesByCategory: Array<{
    name: string;
    value: number;
  }>,
  regionDistribution: Array<{
    region: string;
    users: number;
    places: number;
  }>,
  dailyActivity: Array<{
    time: string;
    requests: number;
  }>
}
```

### 4. 로그 API
```typescript
// GET /api/admin/logs?level=ERROR&service=User&page=1&limit=25
{
  logs: Array<{
    id: string;
    timestamp: string;
    level: 'ERROR' | 'WARNING' | 'INFO' | 'DEBUG';
    service: string;
    message: string;
    userId?: string;
  }>,
  total: number;
  page: number;
  limit: number;
}
```

---

## 🚀 배포 및 테스트

### 로컬 개발 환경
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 관리자 페이지 접속
http://localhost:5173/admin
```

### Docker 배포
```bash
# 프론트엔드 빌드 및 실행
cd maltan-frontend
docker compose up -d --build

# 접속
http://localhost:3000/admin
```

### Ubuntu VM 배포
```bash
# SSH 접속
ssh root@<VM_IP>

# 최신 코드 가져오기
cd ~/maltan-project/maltan_frontend
git pull origin main

# Docker 재시작
docker compose down
docker compose up -d --build

# 접속
http://<VM_IP>:3000/admin
```

---

## 📝 개발 우선순위

### Phase 1: 완료 ✅
- [x] 관리자 레이아웃 및 네비게이션
- [x] 대시보드 (Mock 데이터)
- [x] 사용자 관리 (Mock 데이터)
- [x] 통계 페이지 (Mock 데이터)
- [x] 로그 페이지 (Mock 데이터)
- [x] 권한 체크 (PrivateRoute)

### Phase 2: 백엔드 연동 (진행 예정)
- [ ] 대시보드 API 연동
- [ ] 사용자 관리 API 연동
- [ ] 통계 API 연동
- [ ] 로그 API 연동
- [ ] 실시간 데이터 업데이트 (WebSocket/SSE)

### Phase 3: 추가 기능 (향후)
- [ ] 장소 관리 페이지 구현
- [ ] 커뮤니티 관리 페이지 구현
- [ ] 시스템 설정 페이지 구현
- [ ] 알림 기능
- [ ] 데이터 내보내기 (CSV/Excel)
- [ ] 다크 모드

---

## 🔒 보안 고려사항

### 1. 인증 및 권한
- JWT 토큰 기반 인증
- 관리자 권한 체크 (role === 'ADMIN')
- 세션 타임아웃 설정

### 2. API 보안
- CORS 설정
- Rate Limiting
- SQL Injection 방지
- XSS 방지

### 3. 로그 관리
- 민감한 정보 마스킹 (비밀번호, 토큰 등)
- 로그 보관 기간 설정
- 로그 암호화 (필요시)

---

## 💡 사용 팁

### 1. 대시보드 활용
- 매일 아침 대시보드를 확인하여 시스템 상태 점검
- CPU/메모리 사용률이 80% 이상이면 즉시 조치
- 에러율이 5% 이상이면 로그 확인

### 2. 사용자 관리
- 의심스러운 활동이 있는 사용자는 즉시 차단
- 정기적으로 비활성 사용자 정리
- 관리자 권한 부여는 신중하게

### 3. 통계 분석
- 주간/월간 리포트 생성
- 사용자 증가 추이 모니터링
- 인기 지역/카테고리 파악

### 4. 로그 분석
- ERROR 레벨 로그는 매일 확인
- 반복되는 에러 패턴 파악
- 성능 이슈 조기 발견

---

## 📞 문의 및 지원

관리자 페이지 관련 문의사항이나 버그 리포트는 개발팀에 문의해주세요.

**개발 담당**: 프론트엔드 팀
**관련 문서**: 
- `TRAFFIC_MANAGEMENT_GUIDE.md` (트래픽 관리)
- `DEPLOY_GUIDE.md` (배포 가이드)

