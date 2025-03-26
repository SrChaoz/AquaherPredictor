import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/datos-predic';

export const fetchAllData = async () => {
  try {
    const response = await axios.get(API_BASE);
    return response.data;
  } catch (error) {
    console.error("Error al obtener todos los datos predichos:", error);
    throw error;
  }
};

export const fetchDataByDate = async (fecha) => {
  try {
    const response = await axios.get(`${API_BASE}?fecha=${fecha}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener datos por fecha (${fecha}):`, error);
    throw error;
  }
};
