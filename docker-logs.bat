@echo off
REM Windows용 Docker 로그 확인 스크립트

echo ====================================
echo Maltan Frontend Docker Logs
echo ====================================
echo.

REM 현재 디렉토리 확인
cd /d %~dp0

echo 실시간 로그 확인 중... (Ctrl+C로 종료)
echo.

docker-compose logs -f frontend

