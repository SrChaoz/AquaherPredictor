import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build', // Cambia el directorio de salida a "build"
  },
  server: {
    port: 3001,
    allowedHosts: ['.ngrok-free.app','all']  //  dominio de aplicación
  },
  resolve: {
    alias: {
      '@': '/frontend/src'
    }
  }
});
// Compare this snippet from frontend/src/components/PredictionForm.jsx:
// import React, { useState } from 'react';
// import { getPrediction } from '../services/predictionService';
//
// const PredictionForm = () => {
//     const [fecha, setFecha] = useState('');
//     const [resultado, setResultado] = useState(null);
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const data = await getPrediction(fecha);
//             setResultado(data.prediction);
//         } catch (error) {
//             alert('Error al obtener la predicción.');
//         }
//     };