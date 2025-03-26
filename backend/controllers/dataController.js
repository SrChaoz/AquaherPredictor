const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig'); // Archivo de conexión a la base de datos

// Ruta para obtener todos los datos o por fecha
router.get('/api/data', async (req, res) => {
    const { fecha } = req.query;

    try {
        let result;
        if (fecha) {
            result = await pool.query('SELECT * FROM obtener_datos_por_fecha($1)', [fecha]);
        } else {
            result = await pool.query('SELECT * FROM calidad_agua ORDER BY fecha DESC');
        }

        res.json(result.rows);
    } catch (error) {
        console.error('Error al consultar la base de datos:', error);
        res.status(500).json({ error: 'Error al obtener los datos de la base de datos.' });
    }
});

module.exports = router;
