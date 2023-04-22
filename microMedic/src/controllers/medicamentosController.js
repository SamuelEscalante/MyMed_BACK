const { Router } = require('express');
const router = Router();
const medicamentosModel = require('../models/medicamentosModel');

router.get('/medicamentos', async (req, res) => {
    const ID_MEDICAMENTO = req.params.ID_MEDICAMENTO;
    var result;
    result = await medicamentosModel.traermedicamentos();
    
    res.json(result[0]);
});

router.get('/medicamentos/:ID_MEDICAMENTO', async (req, res) => {
    const ID_MEDICAMENTO = req.params.ID_MEDICAMENTO;
    var result;
    result = await medicamentosModel.traermedicamento(ID_MEDICAMENTO);
    
    res.json(result[0]);
});
router.put('/medicamentos/:ID_MEDICAMENTO', async (req, res) => {
    const ID_MEDICAMENTO = req.params.ID_MEDICAMENTO;
    const INVENTARIO = req.body.INVENTARIO;
    if (INVENTARIO < 0) {
        res.send("el inventario no puede ser menor de cero");
        return;
    }
    var result = await medicamentosModel.actualizarmedicamento(ID_MEDICAMENTO, INVENTARIO);
    res.send("Inventario de medicamentos actualizado");
});
router.post('/medicamentos', async (req, res) => {
    const DESCRIPCION = req.body.DESCRIPCION;
    const PRECIO_UNITARIO = req.body.PRECIO_UNITARIO;
    const INVENTARIO = req.body.INVENTARIO;
    var result = await medicamentosModel.crearmedicamento(DESCRIPCION, PRECIO_UNITARIO,INVENTARIO);
    res.send("medicamento creado");
});
module.exports = router;