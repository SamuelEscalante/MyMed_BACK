const express = require('express');
const router = express.Router();
const axios = require('axios');
const comprasModel = require('../models/comprasModel');

router.get('/compras', async (req, res) => {
    var result;
    result = await comprasModel.traerCompras();
    res.json(result);
});

router.get('/notificaciones', async (req, res) => {
    var result;
    result = await comprasModel.traerNotificaciones();
    res.json(result);
});

router.get('/compras/:id', async (req, res) => {
    const id = req.params.id;
    console.log('|--|')
    var result;
    result = await comprasModel.traerCompra(id);
    res.json(result);
});

router.get('/compras/usuarios/:user', async (req, res) => {
    const user = req.params.user;
    const response = await
        axios.get(`http://192.168.100.2:3001/usuarios/${user}`);
    const nombre = response.data.nombre
    var result;
    result = await comprasModel.traerCompraCliente(nombre);
    res.json(result);
});

router.post('/compras', async (req, res) => {
    const usuario = req.body.usuario;
    const orden = req.body.items;
    console.log(req.body);
    const informacionCuenta = await calcularTotal(orden);
    const totalCuenta = informacionCuenta[0];
    const insertarValores = informacionCuenta[1].join(",");
    // Si el total es 0 o negativo, retornamos un error
    if (totalCuenta <= 0) {
        return res.json({ error: 'Compra Invalida total' });
    }
    // Verificamos si hay suficientes unidades de los productos para realizar la orden
    const disponibilidad = await verificarDisponibilidad(orden);
    // Si no hay suficientes unidades de los productos, retornamos un error
    if (!disponibilidad) {
        return res.json({ error: 'No hay disponibilidad de medicamentos' });
    }
    // Creamos la orden
    const response = await
        axios.get(`http://192.168.100.2:3001/usuarios/${usuario}`);
    const name = response.data.nombre;
     
    compra = {
        "user": name,  "totalCuenta": totalCuenta
    }
    const ordenRes = await comprasModel.crearCompra(compra);
    const ordenDetalle = await comprasModel.crearDetalleCompra(insertarValores);
    // Disminuimos la cantidad de unidades de los productos
    await actualizarInventario(orden);
    return res.send("orden creada");
});
// Función para calcular el total de la ordn
async function calcularTotal(orden) {
    if (!Array.isArray(orden)) {
        throw new Error('La variable orden no es un arreglo');
    }

    let ordenTotal = 0;
    let arrayOrden = [];
    let valorMedicamento
    for (const medicamento of orden) {
       const response = await axios.get(`http://192.168.100.2:3002/medicamentos/${medicamento.ID_MEDICAMENTO}`);
	console.log(response.data[0]);
        valorMedicamento = response.data[0].PRECIO_UNITARIO * parseFloat(medicamento.cantidad);
        ordenTotal += valorMedicamento;
        arrayOrden.push(`(null, ${usuario}, ${response.data[0].DESCRIPCION}, ${medicamento.cantidad}, ${valorMedicamento})`)
    }
    return (ordenTotal, arrayOrden);
}

// Función para verificar si hay suficientes unidades de los productos para realizar la orden 
async function verificarDisponibilidad(orden) {
    let disponibilidad = true;
    for (const medicamento of orden) {
        const response = await
            axios.get(`http://192.168.100.2:3002/medicamentos/${medicamento.ID_MEDICAMENTO}`);
        if (response.data[0].INVENTARIO < parseFloat(medicamento.cantidad)) {
            disponibilidad = false;
            break;
        }
    }
    return disponibilidad;
}
// Función para disminuir la cantidad de unidades de los productos
async function actualizarInventario(orden) {
    for (const medicamento of orden) {
        const response = await
            axios.get(`http://192.168.100.2:3002/medicamentos/${medicamento.ID_MEDICAMENTO}`);
        const inventarioActual = response.data[0].INVENTARIO;
        const inv = inventarioActual - parseFloat(medicamento.cantidad);
        await axios.put(`http://192.168.100.2:3002/medicamentos/${medicamento.ID_MEDICAMENTO}`, {
            INVENTARIO: inv
        });
    }
}
module.exports = router;
