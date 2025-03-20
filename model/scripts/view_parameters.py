import pickle
import pandas as pd

# Cargar el objeto GridSearchCV
with open('grid_search_rf_model.pkl', 'rb') as file:
    grid_search = pickle.load(file)

# Ver los mejores parámetros encontrados
print("Best Parameters:", grid_search.best_params_)

# Ver el mejor score (puntuación) obtenida
print("Best Score:", grid_search.best_score_)

# Convertir los resultados de GridSearchCV a un DataFrame de pandas
results = pd.DataFrame(grid_search.cv_results_)

# Mostrar las 5 mejores combinaciones de parámetros con su respectiva puntuación
print(results[['param_n_estimators', 'param_max_depth', 'mean_test_score']].head())
