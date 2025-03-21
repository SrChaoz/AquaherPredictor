## **Descripción**
Este modelo de predicción está implementado en Python usando el algoritmo **Random Forest**. Se encarga de predecir los siguientes parámetros de calidad del agua:

- pH
- TDS (Total de Sólidos Disueltos)
- Conductividad
- Color
- Turbidez
- Dureza

## **Requisitos**
- Python 3.10+
- Instalación de dependencias mediante el archivo `requirements.txt`:
```bash
pip install -r requirements.txt
```

## **Entrenamiento del Modelo**
El modelo utiliza como variables de entrada:
- `Dias_Transcurridos`
- `Mes`
- `Dia`
- `Dia_semana`

El script de entrenamiento se encuentra en la carpeta `model/`.

## **Ejecución del Servidor Flask**
```bash
cd model
python app.py
```

La API tendrá las siguientes rutas:
- **`POST /predict`**: Recibe una fecha como entrada y retorna los parámetros predichos.

## **Estructura del Proyecto**
```
model/
├── model/
├── scripts/
├── app.py
├── requirements.txt
├── README.md
```

## **Notas Finales**
- En caso de querer entrenar le modelo de nuevo agregar un archivo .env en la raiz de el proyecto con tus crdenciales
- Se implementaron mejoras en el diseño del modelo para mejorar la precisión.  
- Se recomienda verificar que las dependencias estén actualizadas para garantizar el correcto funcionamiento.

---


