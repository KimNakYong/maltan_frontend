# 프론트엔드 배포 가이드

## Ubuntu VM에서 배포하기

### 1. 최신 코드 가져오기
```bash
cd ~/maltan-project/maltan_frontend
git pull origin main
```

### 2. Docker 컨테이너 재시작
```bash
# 기존 컨테이너 중지 및 삭제
docker compose down

# 새로 빌드 및 실행
docker compose up -d --build
```

### 3. 배포 확인
```bash
# 컨테이너 상태 확인
docker ps

# 로그 확인
docker compose logs -f frontend

# 브라우저에서 접속
# http://localhost:3000 (VM 내부)
# http://<VM_IP>:3000 (외부)
```

### 4. 문제 발생 시
```bash
# 컨테이너 재시작
docker compose restart

# 완전히 새로 빌드
docker compose down
docker compose build --no-cache
docker compose up -d
```

## Windows에서 배포 명령 실행하기

### SSH로 Ubuntu VM 접속
```powershell
ssh root@<VM_IP>
```

### 또는 한 줄 명령어로 실행
```powershell
ssh root@<VM_IP> "cd ~/maltan-project/maltan_frontend && git pull origin main && docker compose down && docker compose up -d --build"
```

## 주요 변경사항

### 이번 업데이트 (2025-10-24)
- ✅ 회원가입 시 관심 지역 선택 기능 추가
- ✅ 주소 입력 → 시/도 및 구/군 선택 방식으로 변경
- ✅ 최대 3개 지역 선택 가능 (우선순위 자동 지정)
- ✅ 전국 17개 시/도 및 구/군 데이터 포함

### 백엔드 API 연동 필요사항
회원가입 API에서 다음 형식의 데이터를 받을 수 있어야 합니다:

```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "홍길동",
  "phone": "010-1234-5678",
  "preferredRegions": [
    {
      "city": "seoul",
      "cityName": "서울특별시",
      "district": "gangnam",
      "districtName": "강남구",
      "priority": 1
    }
  ]
}
```

## 환경 변수

`docker-compose.yml`에서 설정된 환경 변수:
- `VITE_API_BASE_URL`: 백엔드 API 주소 (기본값: http://localhost:8080)
- `VITE_GOOGLE_MAPS_API_KEY`: Google Maps API 키

환경 변수 변경 시 재빌드 필요:
```bash
docker compose down
docker compose up -d --build
```

## 외부 접속 (ngrok)

다른 개발자가 외부에서 접속하려면:

```powershell
# Windows에서 ngrok 실행
ngrok http 3000
```

생성된 URL을 공유하면 됩니다.

