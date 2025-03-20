const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); 
const predictionRoutes = require('./routes/predictionRoutes');
const dataController = require('./controllers/dataController');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const PORT = 3000;

//Midelwares
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

//Rutas
app.use('/api/predict', predictionRoutes);
app.use(dataController);
app.use(uploadRoutes);

//Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
