const pool = require('../config/dbConfig');

// Guardar datos predichos
const guardarDatosPredic = async (req, res) => {
    try {
      const {
        fecha,
        ph,
        turbidez,
        conductividad,
        tds,
        dureza,
        color,
        ica
      } = req.body;
  
      const resultado = await pool.query(
        `SELECT insertar_datos_predic($1, $2, $3, $4, $5, $6, $7, $8)`,
        [fecha, ph, turbidez, conductividad, tds, dureza, color, ica]
      );
  
      res.status(201).json({ mensaje: '✅ Datos insertados correctamente', resultado: resultado.rows[0] });
    } catch (error) {
      console.error('Error al guardar datos predichos mediante función:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
  

// Obtener datos con paginación y búsqueda por fecha
const obtenerDatosPredic = async (req, res) => {
  try {
    const { page = 1, limit = 10, fecha } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM datos_predic';
    const params = [];

    if (fecha) {
      query += ' WHERE fecha = $1';
      params.push(fecha);
    }

    query += ' ORDER BY fecha DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit);
    params.push(offset);

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener datos predichos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Exportar funciones usando CommonJS
module.exports = {
  guardarDatosPredic,
  obtenerDatosPredic
};
