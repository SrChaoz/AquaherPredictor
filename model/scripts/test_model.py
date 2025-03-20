import pickle
import numpy as np
import pandas as pd

# Cargar el modelo previamente entrenado
with open('best_rf_model.pkl', 'rb') as file:
    best_rf_regressor = pickle.load(file)

new_data = {
    'Dias_Transcurridos': [100, 200, 300],  # días de transcurrido
    'Mes': [1, 2, 3],  # mes de la medición
    'Dia': [10, 20, 30],  # día del mes
    'Dia_semana': [2, 3, 4],  # día de la semana
    'ica': [0.5, 0.6, 0.7]  # valores anteriores de ICA
}

# Convertir los datos a un DataFrame
new_df = pd.DataFrame(new_data)

# Hacer predicciones
predictions = best_rf_regressor.predict(new_df)

# Mostrar las predicciones
print("Predicciones para los nuevos datos de ICA:", predictions)

#Cambiar el modleo para que en vez de predecir el ica prediga los parametros de calidad del agua de turbiedad, etc en base a los parametros antiguos y la fecha 
