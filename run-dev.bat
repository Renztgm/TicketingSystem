@echo off
setlocal

start "Frontend" /D "%~dp0frontend" cmd /k npm run dev
start "Backend" /D "%~dp0backend" cmd /k npm run server

endlocal