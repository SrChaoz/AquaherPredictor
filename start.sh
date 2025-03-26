#!/bin/bash

echo "=============================================="
echo "Iniciando el entorno virtual para el modelo..."
cd model
source venv/bin/activate
nohup python3 app.py &  # Iniciar el modelo en segundo plano
cd ..

echo "=============================================="
echo "Iniciando el backend..."
cd backend
nohup npm start &  # Iniciar el backend en segundo plano

echo "=============================================="
echo "Iniciando el frontend..."
cd frontend
nohup npm run dev &  # Iniciar el frontend en segundo plano
cd ..

sleep 5

echo "=============================================="
echo "Abriendo el navegador en http://localhost:3001/"
xdg-open http://localhost:3001/ || open http://localhost:3001/

echo "Sistema iniciado correctamente."
