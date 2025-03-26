import axios from 'axios';

const API_URL = 'http://localhost:3000/api/datos-predic';

export const guardarPrediccion = async (fecha, datos) => {
  try {
    const payload = {
      fecha,
      ...datos
    };
    const response = await axios.post(API_URL, payload);
    return response.data;
  } catch (error) {
    console.error('Error al guardar la predicción:', error);
    throw error;
  }
};
