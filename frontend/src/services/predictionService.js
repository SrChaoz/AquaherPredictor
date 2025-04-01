import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/predict';

// Obtener predicción enviando una fecha
export const getPrediction = async (fecha) => {
    const response = await axios.post(BASE_URL, { fecha });
    return response.data;
};
