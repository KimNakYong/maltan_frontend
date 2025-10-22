# Google Maps API 설정 가이드

## 📍 **Google Maps API란?**

Google Maps Platform은 구글에서 제공하는 지도 및 위치 기반 서비스 API입니다.

## 🔑 **API 키 발급 방법**

### **1단계: Google Cloud Console 접속**

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. Google 계정으로 로그인

### **2단계: 프로젝트 생성**

1. 상단의 프로젝트 선택 드롭다운 클릭
2. "새 프로젝트" 클릭
3. 프로젝트 이름 입력 (예: "maltan-project")
4. "만들기" 클릭

### **3단계: Google Maps API 활성화**

1. 좌측 메뉴에서 "API 및 서비스" → "라이브러리" 선택
2. 다음 API들을 검색하고 각각 활성화:
   - **Maps JavaScript API** (필수)
   - **Places API** (장소 검색용)
   - **Geocoding API** (주소 → 좌표 변환)
   - **Distance Matrix API** (거리 계산)

### **4단계: API 키 생성**

1. 좌측 메뉴에서 "API 및 서비스" → "사용자 인증 정보" 선택
2. "사용자 인증 정보 만들기" → "API 키" 선택
3. API 키가 생성됨 (예: `AIzaSyBxxxxxxxxxxxxxxxxxxxxxx`)
4. 키를 복사해두기

### **5단계: API 키 제한 설정 (권장)**

보안을 위해 API 키에 제한을 설정하세요:

1. 생성된 API 키 옆의 편집(연필) 아이콘 클릭
2. **애플리케이션 제한사항** 섹션:
   - "HTTP 리퍼러(웹사이트)" 선택
   - 허용할 도메인 추가:
     ```
     http://localhost:3000/*
     http://localhost:5173/*
     https://yourdomain.com/*
     ```

3. **API 제한사항** 섹션:
   - "키 제한" 선택
   - 다음 API 선택:
     - Maps JavaScript API
     - Places API
     - Geocoding API
     - Distance Matrix API

4. "저장" 클릭

## ⚙️ **프로젝트에 API 키 설정**

### **개발 환경**

`.env.development` 파일 수정:

```bash
VITE_API_BASE_URL=http://localhost:8080
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxx
VITE_ENV=development
```

### **프로덕션 환경**

`.env.production` 파일 생성:

```bash
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxx
VITE_ENV=production
```

### **Docker 빌드 시**

`docker-compose.yml` 파일 수정:

```yaml
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        VITE_API_BASE_URL: http://localhost:8080
        VITE_GOOGLE_MAPS_API_KEY: AIzaSyBxxxxxxxxxxxxxxxxxxxxxx
```

## 🎯 **사용 방법**

### **1. 기본 지도 표시**

```tsx
import GoogleMap from './components/GoogleMap';

function App() {
  return (
    <GoogleMap
      center={{ lat: 37.5665, lng: 126.9780 }}
      zoom={13}
    />
  );
}
```

### **2. 마커 표시**

```tsx
<GoogleMap
  center={{ lat: 37.5665, lng: 126.9780 }}
  zoom={13}
  markers={[
    {
      id: '1',
      position: { lat: 37.5665, lng: 126.9780 },
      title: '서울시청',
      onClick: () => alert('서울시청'),
    },
  ]}
/>
```

### **3. 지도 클릭 이벤트**

```tsx
<GoogleMap
  center={{ lat: 37.5665, lng: 126.9780 }}
  zoom={13}
  onMapClick={(lat, lng) => {
    console.log('클릭한 위치:', lat, lng);
  }}
/>
```

### **4. 사용자 현재 위치**

```tsx
import { useCurrentLocation } from './hooks/useGoogleMaps';

function MyComponent() {
  const { location, loading, getCurrentLocation } = useCurrentLocation();

  return (
    <div>
      <button onClick={getCurrentLocation}>내 위치</button>
      {location && (
        <GoogleMap
          center={location}
          zoom={15}
        />
      )}
    </div>
  );
}
```

### **5. 장소 검색**

```tsx
import { usePlacesSearch } from './hooks/useGoogleMaps';

function SearchComponent({ map }: { map: google.maps.Map | null }) {
  const { results, loading, searchByText } = usePlacesSearch(map);

  const handleSearch = () => {
    searchByText('강남역 맛집');
  };

  return (
    <div>
      <button onClick={handleSearch}>검색</button>
      {results.map((place) => (
        <div key={place.place_id}>{place.name}</div>
      ))}
    </div>
  );
}
```

## 💰 **요금 정보**

### **무료 크레딧**

Google Maps Platform은 매월 $200의 무료 크레딧을 제공합니다.

### **주요 API 요금**

- **Maps JavaScript API**: 1,000건당 $7
- **Places API**: 
  - Nearby Search: 1,000건당 $32
  - Text Search: 1,000건당 $32
- **Geocoding API**: 1,000건당 $5
- **Distance Matrix API**: 1,000건당 $5

### **무료 범위**

$200 무료 크레딧으로 매월 약 28,500개의 지도 로드가 가능합니다.

### **비용 절감 팁**

1. **API 키 제한 설정**: 무단 사용 방지
2. **캐싱 활용**: 동일한 요청 반복 방지
3. **필요한 API만 활성화**: 불필요한 API 비활성화
4. **결제 한도 설정**: 예상치 못한 요금 방지

## 🔒 **보안 Best Practices**

### **1. API 키 보호**

```bash
# .gitignore에 추가
.env
.env.local
.env.development
.env.production
```

### **2. HTTP 리퍼러 제한**

```
http://localhost:3000/*
http://localhost:5173/*
https://yourdomain.com/*
```

### **3. API 제한**

필요한 API만 선택하여 제한

### **4. 사용량 모니터링**

Google Cloud Console에서 API 사용량 정기 확인

## 📊 **API 사용량 확인**

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 좌측 메뉴 → "API 및 서비스" → "대시보드"
3. 각 API의 사용량 그래프 확인
4. "할당량" 탭에서 한도 설정 가능

## 🚨 **문제 해결**

### **1. API 키 오류**

```
Error: InvalidKeyMapError
```

**해결:**
- API 키가 올바른지 확인
- Maps JavaScript API가 활성화되어 있는지 확인

### **2. 리퍼러 제한 오류**

```
Error: RefererNotAllowedMapError
```

**해결:**
- API 키 제한 설정에서 현재 도메인 추가
- `http://localhost:3000/*` 추가

### **3. 요금 한도 초과**

```
Error: OverQueryLimitError
```

**해결:**
- Google Cloud Console에서 결제 정보 등록
- 또는 사용량 줄이기 (캐싱, 최적화)

### **4. 장소 검색 실패**

```
ZERO_RESULTS
```

**해결:**
- Places API가 활성화되어 있는지 확인
- 검색어 또는 위치 확인

## 🔗 **참고 자료**

- [Google Maps Platform 공식 문서](https://developers.google.com/maps/documentation)
- [Maps JavaScript API 가이드](https://developers.google.com/maps/documentation/javascript/overview)
- [Places API 가이드](https://developers.google.com/maps/documentation/places/web-service/overview)
- [요금 계산기](https://mapsplatformtransition.withgoogle.com/calculator)

## ✅ **체크리스트**

개발 시작 전 확인:

- [ ] Google Cloud Console 프로젝트 생성
- [ ] Maps JavaScript API 활성화
- [ ] Places API 활성화
- [ ] API 키 생성
- [ ] API 키 제한 설정
- [ ] `.env.development` 파일에 API 키 추가
- [ ] `.gitignore`에 `.env` 파일 추가
- [ ] 결제 정보 등록 (무료 크레딧 사용)

---

**Google Maps API 설정 완료!** 이제 지도 기능을 사용할 수 있습니다! 🗺️

