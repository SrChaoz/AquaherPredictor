const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig'); // Archivo de conexión a la base de datos

// Ruta para obtener datos por fecha
router.get('/api/data', async (req, res) => {
    const { fecha } = req.query;

    if (!fecha) {
        return res.status(400).json({ error: "La fecha es obligatoria." });
    }

    try {
        const result = await pool.query(
            `SELECT * FROM obtener_datos_por_fecha($1)`, 
            [fecha]
        );

        if (result.rows.length === 0) {
            res.json([]);
        } else {
            res.json(result.rows);
        }

    } catch (error) {
        console.error('Error al consultar la base de datos:', error);
        res.status(500).json({ error: 'Error al obtener los datos de la base de datos.' });
    }
});

module.exports = router;
