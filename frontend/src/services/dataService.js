import axios from 'axios';

export const fetchDataByDate = async (fecha) => {
    try {
        const response = await axios.get(`http://localhost:3000/api/data?fecha=${fecha}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        return [];
    }
};

