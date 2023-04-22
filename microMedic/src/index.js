const express = require('express');
const productosController = require('./controllers/medicamentosController');
const morgan = require('morgan');
const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(productosController);
app.listen(3002, () => {
    console.log('Microservicio medicamentos ejecutandose en el puerto 3002');
});