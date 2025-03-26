@echo off
title Iniciando Sistema de Predicción de Calidad del Agua
echo ==============================================
echo Iniciando el entorno virtual para el modelo...
cd model
call venv\Scripts\activate
start cmd /k "python app.py"
cd ..

echo ==============================================
echo Iniciando el backend...
cd backend
start cmd /k "npm start"
cd ..

echo ==============================================
echo Iniciando el frontend...
cd frontend
start cmd /k "npm run dev"
cd ..


timeout /t 5 /nobreak

echo ==============================================
echo Abriendo el navegador en http://localhost:3001/
start http://localhost:3001/

pause
