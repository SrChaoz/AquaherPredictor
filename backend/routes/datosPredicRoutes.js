const express = require('express');
const router = express.Router();
const { guardarDatosPredic, obtenerDatosPredic } = require('../controllers/datosPredicController');

router.post('/datos-predic', guardarDatosPredic);
router.get('/datos-predic', obtenerDatosPredic);

module.exports = router;
