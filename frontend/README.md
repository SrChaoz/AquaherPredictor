# README - Frontend

## Descripción
El frontend está desarrollado en React (Vite) y permite:
- Enviar una fecha para obtener predicciones de los parámetros del agua.
- Visualizar datos almacenados en la base de datos con una herramienta de búsqueda por fecha.
- Cargar datos adicionales a la base de datos mediante un formulario mejorado.

## Instalación
```bash
cd frontend
npm install
```

## Configuración
1. Crear un archivo `.env` en la carpeta `frontend` con el siguiente contenido:
```
VITE_API_URL=http://localhost:3000
```

2. Para ejecutar el frontend:
```bash
npm run dev
```

## Estructura de Pantallas
- **Inicio**: Formulario de predicción centrado en pantalla.
- **Visualizar Datos**: Tabla moderna con opciones de búsqueda por fecha.
- **Cargar Datos**: Formulario mejorado para subir datos.

---

# README - Modelo de Machine Learning

## Descripción
El modelo de predicción está implementado en Python usando el algoritmo **Random Forest**. Este modelo se encarga de predecir los siguientes parámetros:
- pH
- TDS (Total de Sólidos Disueltos)
- Conductividad
- Color
- Turbidez
- Dureza

## Requisitos
- Python 3.10+
- Librerías necesarias:
```bash
pip install pandas scikit-learn numpy flask
```

## Entrenamiento del Modelo
El modelo utiliza como variables de entrada:
- `Dias_Transcurridos`
- `Mes`
- `Dia`
- `Dia_semana`

El script de entrenamiento se encuentra en la carpeta `modelo/`.

## Ejecución del Servidor Flask
```bash
cd modelo
python app.py
```

La API tendrá las siguientes rutas:
- **`POST /predict`**: Recibe una fecha como entrada y retorna los parámetros predichos.

## Notas Finales
- Se implementaron mejoras en el diseño de la interfaz siguiendo la paleta de colores de la empresa.
- El frontend, backend y modelo están integrados para facilitar la experiencia del usuario.

