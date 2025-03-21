from flask import Flask, request, jsonify
import pickle
import pandas as pd
import numpy as np
from datetime import datetime

# Cargar el modelo previamente entrenado
try:
    with open('./model/best_rf_model.pkl', 'rb') as file:
        modelo_rf = pickle.load(file)
except FileNotFoundError:
    modelo_rf = None

try:
    with open('./model/best_xgb_model.pkl', 'rb') as file:
        modelo_xgb = pickle.load(file)
except FileNotFoundError:
    modelo_xgb = None

if not modelo_rf and not modelo_xgb:
    raise ValueError("❌ No se encontró ningún modelo entrenado (RandomForest ni XGBoost).")

# Determinar qué modelo está disponible
modelo_actual = modelo_rf if modelo_rf else modelo_xgb
print(f"✅ Modelo cargado: {'RandomForest' if modelo_rf else 'XGBoost'}")

app = Flask(__name__)

# Función para convertir una fecha en las características necesarias
def convertir_fecha(fecha_str):
    fecha = datetime.strptime(fecha_str, "%Y-%m-%d")
    hoy = datetime.now()

    return pd.DataFrame({
        'Dias_Transcurridos': [(fecha - hoy).days],
        'Mes': [fecha.month],
        'Dia': [fecha.day],
        'Dia_semana': [fecha.weekday()]  # 0 = Lunes, 6 = Domingo
    })

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json

    # Validar que la fecha esté presente en el body
    if 'fecha' not in data:
        return jsonify({'error': 'La fecha es obligatoria'}), 400

    # Convertir la fecha en las características necesarias
    try:
        fecha_df = convertir_fecha(data['fecha'])
    except ValueError:
        return jsonify({'error': 'Formato de fecha inválido (usar YYYY-MM-DD)'}), 400

    # Realizar la predicción
    try:
        prediction = modelo_actual.predict(fecha_df)

        # Convertir las predicciones a tipo float estándar
        prediction = np.array(prediction).astype(float).tolist()

        resultados = {
            'ph': round(prediction[0][0], 2),
            'turbidez': round(prediction[0][1], 2),
            'conductividad': round(prediction[0][2], 2),
            'tds': round(prediction[0][3], 2),
            'dureza': round(prediction[0][4], 2),
            'color': round(prediction[0][5], 2)
        }
        return jsonify(resultados)
    except Exception as e:
        print(f"❌ Error en la predicción: {e}")
        return jsonify({'error': 'Error en la predicción'}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
