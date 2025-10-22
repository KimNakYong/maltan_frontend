@echo off
REM Windows용 Docker 중지 스크립트

echo ====================================
echo Maltan Frontend Docker Stop
echo ====================================
echo.

REM 현재 디렉토리 확인
cd /d %~dp0

echo [1/2] Docker Compose 중지...
docker-compose down

echo.
echo [2/2] 컨테이너 상태 확인...
docker ps -a | findstr maltan-frontend

echo.
echo ====================================
echo 중지 완료!
echo ====================================
echo.
pause

