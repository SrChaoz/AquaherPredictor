const axios = require('axios');

exports.predict = async (data) => {
    try {
        const response = await axios.post('http://localhost:5000/predict', data);
        return response.data;
    } catch (error) {
        console.error('Error en predictionService:', error.response?.data || error.message);
        throw new Error('Error en la predicción');
    }
};
