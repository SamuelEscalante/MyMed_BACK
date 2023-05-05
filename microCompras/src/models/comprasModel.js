const mysql = require('mysql2/promise');
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'inventariomymed'
});
async function crearCompra(compra) {
    const user = compra.user;
    const totalCuenta = compra.totalCuenta;
    const FechaCompra = compra.FechaCompra
    const result = await connection.query('INSERT INTO compras VALUES (null, ?, ?, Now())', [user, totalCuenta, FechaCompra]);
    return result[0];
}
async function crearDetalleCompra(compras) {  
    const result = await connection.query(`INSERT INTO medicamentos_por_usuarios (id, usuario, medicamento_nombre, cantidad, precio_total, medicamento_id, compra_id) VALUES ${compras}`, []);
    return result;
}
async function traerCompra(id) {
    const user = await connection.query('SELECT usuario, jefe FROM usuarios WHERE usuario = ?', id);
    const dict_send = {}
    let result;
    if (user[0][0].jefe == 1) {
        result = await connection.query('SELECT medic.usuario AS usuario, medic.medicamento_id AS medicamentoId, medic.medicamento_nombre AS medicamentoNombre, medic.cantidad AS cantidad, medic.precio_total AS precioTotal, compras.totalCuenta AS totalCuenta, DATE_FORMAT(compras.FechaCompra, "%M %e %Y") AS FechaCompra, compras.id AS comprasId  FROM medicamentos_por_usuarios AS medic INNER JOIN compras ON medic.compra_id = compras.id ORDER BY compras.id DESC', []);
    } else {
        result = await connection.query('SELECT medic.usuario AS usuario, medic.medicamento_id AS medicamentoId, medic.medicamento_nombre AS medicamentoNombre, medic.cantidad AS cantidad, medic.precio_total AS precioTotal, compras.totalCuenta AS totalCuenta, DATE_FORMAT(compras.FechaCompra, "%M %e %Y") AS FechaCompra, compras.id AS comprasId  FROM medicamentos_por_usuarios AS medic INNER JOIN compras ON medic.compra_id = compras.id WHERE compras.nombreCliente = ? ORDER BY compras.id DESC', user[0][0].usuario);
    }
    return result[0];
    return dict_send;
}

async function traerNotificaciones() {
    const result = await connection.query('SELECT * FROM notificaciones');
    return result[0];
}
async function traerCompraCliente(nombre) {
    const result = await connection.query('SELECT * FROM compras WHERE nombreCliente = ?', nombre);
    return result[0];
}

async function traerCompras() {
    const result = await connection.query('SELECT medic.usuario AS usuario, medic.medicamento_id AS medicamentoId, medic.medicamento_nombre AS medicamentoNombre, medic.cantidad AS cantidad, medic.precio_total AS precioTotal, compras.totalCuenta AS totalCuenta, DATE_FORMAT(compras.FechaCompra, "%M %e %Y") AS FechaCompra, compras.id AS comprasId  FROM medicamentos_por_usuarios AS medic INNER JOIN compras ON medic.compra_id = compras.id ORDER BY compras.id DESC');
    return result[0];
}
    module.exports = {
    crearCompra,
    traerCompra,
    traerCompras,
    traerCompraCliente,
    traerNotificaciones,
    crearDetalleCompra
};
