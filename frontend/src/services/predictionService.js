import axios from 'axios';

export const getPrediction = async (fecha) => {
    const response = await axios.post('http://localhost:3000/api/predict', { fecha });
    return response.data;
};
