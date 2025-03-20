const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig');
const upload = require('../middlewares/multerConfig'); // ✅ Usar la configuración correcta
const csv = require('csv-parser');
const fs = require('fs');
const moment = require('moment');

// Función para convertir valores a float y manejar NULL
const parseFloatValue = (value) => {
    console.log(`🧮 Valor recibido para conversión: "${value}"`);
    if (!value || value.trim() === '') return null;

    const parsedValue = value.replace(',', '.').trim();
    const result = parseFloat(parsedValue);

    console.log(`✅ Valor convertido: ${result}`);
    return isNaN(result) ? null : result;
};

// Función para formatear la fecha
const formatDate = (value) => {
    console.log(`📅 Fecha recibida para formateo: "${value}"`);
    if (!value || value.trim() === '') return null;

    const formattedDate = moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD');
    console.log(`✅ Fecha formateada: ${formattedDate}`);
    return formattedDate;
};

// Ruta para la carga de datos desde CSV
router.post('/api/upload', upload.single('file'), async (req, res) => {
    console.log("📤 Se recibió una solicitud de carga de archivo...");

    if (!req.file) {
        console.error('❌ No se recibió ningún archivo.');
        return res.status(400).json({ error: 'No se ha recibido ningún archivo.' });
    }

    const filePath = req.file.path;
    console.log(`✅ Archivo recibido: ${req.file.originalname}`);
    console.log(`📂 Ruta del archivo: ${filePath}`); 

    const rows = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            console.log('📄 Fila cruda del CSV:', row);

            const parsedRow = {
                fecha: formatDate(row['fecha']),
                ph: parseFloatValue(row['ph']),
                turbidez: parseFloatValue(row['turbidez']),
                conductividad: parseFloatValue(row['conductividad']),
                tds: parseFloatValue(row['tds']),
                dureza: parseFloatValue(row['dureza']),
                color: parseFloatValue(row['color']),
                ica: parseFloatValue(row['ica'])
            };

            console.log('✅ Fila procesada:', parsedRow);
            rows.push(parsedRow);
        })
        .on('end', async () => {
            try {
                for (const row of rows) {
                    await pool.query(
                        `SELECT insertar_datos($1, $2, $3, $4, $5, $6, $7, $8)`, 
                        [row.fecha, row.ph, row.turbidez, row.conductividad, row.tds, row.dureza, row.color, row.ica]
                    );
                }

                console.log('✅ Inserción completa en la base de datos.');
                res.json({ message: 'Datos subidos exitosamente.' });
            } catch (error) {
                console.error('❌ Error al insertar los datos en la base de datos:', error);
                res.status(500).json({ error: 'Error al subir los datos a la base de datos.' });
            } finally {
                console.log(`🗑️ Eliminando el archivo temporal: ${filePath}`);
                fs.unlinkSync(filePath);
            }
        })
        .on('error', (error) => {
            console.error('❌ Error durante la lectura del archivo:', error);
            res.status(500).json({ error: 'Error al procesar el archivo CSV.' });
        });
});

module.exports = router;
