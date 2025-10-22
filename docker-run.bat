@echo off
REM Windows용 Docker 실행 스크립트

echo ====================================
echo Maltan Frontend Docker Run
echo ====================================
echo.

REM 현재 디렉토리 확인
cd /d %~dp0

echo [1/4] 기존 컨테이너 확인 및 중지...
docker stop maltan-frontend 2>nul
docker rm maltan-frontend 2>nul

echo.
echo [2/4] Docker Compose로 실행...
docker-compose up -d

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Docker 실행 실패!
    pause
    exit /b 1
)

echo.
echo [3/4] 컨테이너 상태 확인...
timeout /t 2 /nobreak >nul
docker ps | findstr maltan-frontend

echo.
echo [4/4] 로그 확인...
echo.
docker-compose logs --tail 20 frontend

echo.
echo ====================================
echo 실행 완료!
echo ====================================
echo.
echo 브라우저에서 확인: http://localhost:3000
echo.
echo 로그 확인: docker-compose logs -f frontend
echo 중지: docker-compose down
echo.
pause

