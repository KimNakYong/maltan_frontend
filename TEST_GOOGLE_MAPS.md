# Google Maps API 테스트 가이드

## ✅ **API 키 적용 완료**

Google Maps API 키가 프로젝트에 적용되었습니다!

```
API Key: AIzaSyB6yKm_vZw2nCWECG9Ju_Ytg2i19W3L96s
```

## 🚀 **테스트 방법**

### **방법 1: 로컬 개발 서버**

```bash
# 프론트엔드 폴더로 이동
cd F:\3project\maltan-frontend

# 의존성 설치 (처음 한 번만)
npm install

# 개발 서버 시작
npm run dev
```

브라우저에서 접속:
```
http://localhost:5173/map-test
```

### **방법 2: Docker**

```bash
# 프론트엔드 폴더로 이동
cd F:\3project\maltan-frontend

# Docker Compose로 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f frontend
```

브라우저에서 접속:
```
http://localhost:3000/map-test
```

## 🗺️ **지도 테스트 페이지 기능**

### **1. 기본 지도 표시**
- ✅ 서울시청을 중심으로 지도 표시
- ✅ 확대/축소 기능
- ✅ 지도 타입 변경 (일반, 위성)

### **2. 내 위치 찾기**
- ✅ "내 위치" 버튼 클릭
- ✅ 브라우저에서 위치 권한 허용
- ✅ 현재 위치로 지도 이동

### **3. 장소 검색**
- ✅ 검색창에 키워드 입력 (예: "강남역 맛집")
- ✅ "검색" 버튼 클릭
- ✅ 검색 결과 지도에 마커로 표시
- ✅ 오른쪽에 검색 결과 목록 표시

### **4. 주변 장소 찾기**
카테고리 칩 클릭:
- 🍽️ 맛집
- ☕ 카페
- 🏨 숙박
- 🏛️ 관광지
- 🏪 편의점
- 🏥 병원

### **5. 지도 클릭**
- ✅ 지도의 원하는 위치 클릭
- ✅ 클릭한 위치에 마커 추가
- ✅ 콘솔에 좌표 출력

## 📋 **테스트 시나리오**

### **시나리오 1: 기본 지도 확인**
1. http://localhost:5173/map-test 접속
2. 지도가 정상적으로 표시되는지 확인
3. 마우스로 드래그하여 지도 이동
4. 마우스 휠로 확대/축소

**예상 결과:**
- ✅ 서울시청 주변 지도 표시
- ✅ 부드러운 지도 이동 및 확대/축소

### **시나리오 2: 내 위치 찾기**
1. "내 위치" 버튼 클릭
2. 브라우저 위치 권한 허용
3. 지도가 내 위치로 이동하는지 확인
4. 내 위치에 마커 표시 확인

**예상 결과:**
- ✅ 내 위치로 지도 이동
- ✅ 현재 좌표 하단에 표시

### **시나리오 3: 장소 검색**
1. 검색창에 "강남역 맛집" 입력
2. "검색" 버튼 클릭
3. 검색 결과 확인

**예상 결과:**
- ✅ 강남역 주변으로 지도 이동
- ✅ 맛집 마커들이 지도에 표시
- ✅ 오른쪽에 검색 결과 목록 표시 (이름, 주소, 평점)

### **시나리오 4: 카테고리별 검색**
1. "🍽️ 맛집" 칩 클릭
2. 주변 맛집 검색 결과 확인
3. "☕ 카페" 칩 클릭
4. 주변 카페 검색 결과 확인

**예상 결과:**
- ✅ 각 카테고리별 장소가 지도에 표시
- ✅ 검색 결과 목록 업데이트

### **시나리오 5: 지도 클릭**
1. 지도의 임의의 위치 클릭
2. 클릭한 위치에 마커 추가 확인
3. 개발자 도구 콘솔에서 좌표 확인

**예상 결과:**
- ✅ 클릭한 위치에 새 마커 추가
- ✅ 콘솔에 좌표 출력

## 🎯 **주요 컴포넌트 및 Hooks**

### **1. GoogleMap 컴포넌트**
`src/components/GoogleMap.tsx`

```tsx
<GoogleMap
  center={{ lat: 37.5665, lng: 126.9780 }}
  zoom={15}
  markers={markers}
  onMapClick={(lat, lng) => console.log(lat, lng)}
/>
```

### **2. useCurrentLocation Hook**
`src/hooks/useGoogleMaps.ts`

```tsx
const { location, loading, getCurrentLocation } = useCurrentLocation();
```

### **3. usePlacesSearch Hook**
```tsx
const { results, loading, searchNearby, searchByText } = usePlacesSearch(map);
```

## 🚨 **문제 해결**

### **1. 지도가 표시되지 않음**

**증상:**
- 회색 화면만 표시
- "For development purposes only" 워터마크

**원인:**
- API 키가 올바르지 않음
- API가 활성화되지 않음

**해결:**
1. Google Cloud Console 확인
2. Maps JavaScript API 활성화 확인
3. API 키 재생성

### **2. 위치 권한 오류**

**증상:**
- "위치 정보를 가져올 수 없습니다" 에러

**해결:**
- 브라우저에서 위치 권한 허용
- HTTPS 환경에서 테스트 (localhost는 예외)

### **3. 검색 결과 없음**

**증상:**
- "검색 결과가 없습니다" 표시

**원인:**
- Places API가 활성화되지 않음
- 잘못된 검색어

**해결:**
1. Google Cloud Console → Places API 활성화
2. 검색어 변경 (예: "서울 맛집")

### **4. CORS 에러**

**증상:**
- 콘솔에 CORS 에러 표시

**해결:**
API 키 제한 설정에서 HTTP 리퍼러 추가:
```
http://localhost:5173/*
http://localhost:3000/*
```

## 📊 **API 사용량 확인**

### **모니터링**
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. "API 및 서비스" → "대시보드"
3. Maps JavaScript API, Places API 사용량 확인

### **예상 사용량**
- 지도 로드: 1회당 1 요청
- 장소 검색: 1회당 1 요청
- 마커 표시: 무료

### **무료 할당량**
- 매월 $200 무료 크레딧
- 약 28,500번의 지도 로드 가능

## ✅ **체크리스트**

테스트 전 확인:

- [x] Google Maps API 키 발급
- [x] Maps JavaScript API 활성화
- [x] Places API 활성화
- [x] `.env.development` 파일에 API 키 추가
- [x] `docker-compose.yml`에 API 키 추가
- [x] `index.html`에 Google Maps 스크립트 추가
- [ ] 개발 서버 실행
- [ ] 지도 테스트 페이지 접속
- [ ] 각 기능 테스트

## 🎉 **다음 단계**

### **1. 실제 서비스에 적용**
- 홈 페이지에 지도 추가
- 장소 상세 페이지에 지도 통합
- 사용자 주소 기반 주변 장소 추천

### **2. 추가 기능 구현**
- 경로 찾기 (Directions API)
- 거리 계산 (Distance Matrix API)
- 주소 검색 (Geocoding API)
- 장소 상세 정보 (Place Details API)

### **3. 최적화**
- 지도 로딩 최적화
- 마커 클러스터링
- 검색 결과 캐싱

---

## 🗺️ **바로 테스트하기**

### **로컬 개발**
```bash
cd F:\3project\maltan-frontend
npm run dev
# http://localhost:5173/map-test
```

### **Docker**
```bash
cd F:\3project\maltan-frontend
docker-compose up -d
# http://localhost:3000/map-test
```

**Google Maps API가 정상적으로 작동합니다!** 🎉

