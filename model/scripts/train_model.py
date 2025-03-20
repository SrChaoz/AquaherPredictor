import pandas as pd
import psycopg2
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import mean_squared_error, r2_score
import pickle
from dotenv import load_dotenv
import os

# Cargar las variables del archivo .env
load_dotenv()

# Conexión a la base de datos PostgreSQL usando variables del .env
conn = psycopg2.connect(
    dbname=os.getenv('DB_NAME'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    host=os.getenv('DB_HOST'),
    port=os.getenv('DB_PORT')
)

# Cargar los datos desde PostgreSQL
query = """
SELECT fecha, ph, turbidez, conductividad, tds, dureza, color
FROM calidad_agua
"""
df_canalMesias = pd.read_sql(query, conn)

# Convertir la columna 'fecha' a tipo datetime
df_canalMesias['Fecha'] = pd.to_datetime(df_canalMesias['fecha'], errors='coerce')

# Extraer características útiles de la fecha (Día de la semana, mes, etc.)
df_canalMesias['Dia_semana'] = df_canalMesias['Fecha'].dt.dayofweek  # Día de la semana (0 = Lunes, 6 = Domingo)
df_canalMesias['Mes'] = df_canalMesias['Fecha'].dt.month  # Mes
df_canalMesias['Dia'] = df_canalMesias['Fecha'].dt.day  # Día del mes

# Crear la columna 'Días Transcurridos' (días de diferencia respecto a la primera fecha)
df_canalMesias['Dias_Transcurridos'] = (df_canalMesias['Fecha'] - df_canalMesias['Fecha'].min()).dt.days

# Eliminar la columna 'fecha' ya que no se usará directamente
df_canalMesias = df_canalMesias.drop(columns=['fecha'])

# Imputar los valores faltantes con la mediana para las columnas numéricas
df_canalMesias.fillna(df_canalMesias.median(), inplace=True)

# Normalizar las variables numéricas
scaler = StandardScaler()
df_canalMesias[['ph', 'turbidez', 'conductividad', 'tds', 'dureza', 'color']] = scaler.fit_transform(
    df_canalMesias[['ph', 'turbidez', 'conductividad', 'tds', 'dureza', 'color']]
)

# Ver los primeros registros después de las modificaciones
print(df_canalMesias.head())

# Definir las características (X) y las variables objetivo (y)
features = ['Dias_Transcurridos', 'Mes', 'Dia', 'Dia_semana']  # 🔹 QUITÉ 'ica' porque no es necesario
target = ['ph', 'turbidez', 'conductividad', 'tds', 'dureza', 'color']

X = df_canalMesias[features]
y = df_canalMesias[target]

# Dividir los datos en conjunto de entrenamiento y prueba
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Definir el parámetro grid para la optimización
param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [5, 10, 20, None],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4],
    'criterion': ['squared_error', 'absolute_error', 'friedman_mse'],
    'max_features': ['sqrt', 'log2', None],
    'bootstrap': [True],
    'random_state': [42]
}

# Crear el modelo RandomForestRegressor
rf_regressor = RandomForestRegressor(random_state=42)

# Realizar la búsqueda de hiperparámetros con GridSearchCV
grid_search = GridSearchCV(estimator=rf_regressor, param_grid=param_grid, cv=5, 
                           scoring='neg_mean_squared_error', return_train_score=True, 
                           n_jobs=-1, verbose=3)
grid_search.fit(X_train, y_train)

# Obtener el mejor modelo y sus hiperparámetros
best_rf_regressor = grid_search.best_estimator_
best_params = grid_search.best_params_

print("Best Hyperparameters:", best_params)

# Evaluar el modelo con el conjunto de prueba
y_pred = best_rf_regressor.predict(X_test)

mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"Mean Squared Error on test set: {mse:.2f}")
print(f"R^2 Score on test set: {r2:.2f}")

# Entrenar el modelo con el conjunto completo de datos
best_rf_regressor.fit(X, y)

# Guardar el mejor modelo
with open('best_rf_model.pkl', 'wb') as file:
    pickle.dump(best_rf_regressor, file)

# Guardar el objeto de GridSearchCV
with open('grid_search_rf_model.pkl', 'wb') as file:
    pickle.dump(grid_search, file)

print("Modelo corregido y guardado exitosamente como 'best_rf_model.pkl'")
print("Objeto GridSearchCV guardado exitosamente como 'grid_search_rf_model.pkl'")
# Cerrar la conexión a la base de datos
conn.close()