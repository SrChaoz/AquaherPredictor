import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/data';

// Obtener todos los datos
export const fetchAllData = async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
};

// Obtener datos por fecha
export const fetchDataByDate = async (fecha) => {
    const response = await axios.get(`${BASE_URL}?fecha=${fecha}`);
    return response.data;
};

// Obtener datos por rango de fechas
export const fetchDataByRange = async (desde, hasta) => {
    try {
      const response = await axios.get(`${BASE_URL}?desde=${desde}&hasta=${hasta}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener datos por rango:", error);
      return [];
    }
};
