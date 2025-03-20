from flask import Flask, request, jsonify
import pickle
import pandas as pd
from datetime import datetime

# Cargar el modelo previamente entrenado
with open('./model/best_rf_model.pkl', 'rb') as file:
    best_rf_regressor = pickle.load(file)

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
        prediction = best_rf_regressor.predict(fecha_df)
        resultados = {
            'ph': prediction[0][0],
            'turbidez': prediction[0][1],
            'conductividad': prediction[0][2],
            'tds': prediction[0][3],
            'dureza': prediction[0][4],
            'color': prediction[0][5]
        }
        return jsonify(resultados)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
