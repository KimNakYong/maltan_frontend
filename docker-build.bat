@echo off
REM Windows용 Docker 빌드 스크립트

echo ====================================
echo Maltan Frontend Docker Build
echo ====================================
echo.

REM 현재 디렉토리 확인
cd /d %~dp0

echo [1/3] Docker 이미지 빌드 중...
docker build -t maltan-frontend:latest .

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Docker 빌드 실패!
    pause
    exit /b 1
)

echo.
echo [2/3] 빌드 완료!
echo.
echo [3/3] Docker 이미지 확인...
docker images | findstr maltan-frontend

echo.
echo ====================================
echo 빌드 완료!
echo ====================================
echo.
echo 다음 명령어로 컨테이너를 실행하세요:
echo   docker-compose up -d
echo.
echo 또는:
echo   docker run -d -p 3000:3000 --name maltan-frontend maltan-frontend:latest
echo.
pause

