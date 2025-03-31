import axios from 'axios';

export const fetchAllData = async () => {
    const response = await axios.get('http://localhost:3000/api/data');
    return response.data;
};

export const fetchDataByDate = async (fecha) => {
    const response = await axios.get(`http://localhost:3000/api/data?fecha=${fecha}`);
    return response.data;
};

export const fetchDataByRange = async (desde, hasta) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/data?desde=${desde}&hasta=${hasta}`
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener datos por rango:", error);
      return [];
    }
  };
  