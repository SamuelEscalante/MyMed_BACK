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
    console.log(compras);
    const result = await connection.query(`INSERT INTO medicamentos_por_usuarios (id, usuario, medicamento_nombre, cantidad, precio_total, medicamento_id, compra_id) VALUES ${compras}`, []);
    return result;
}
async function traerCompra(id) {
    const user = await connection.query('SELECT nombre FROM usuarios WHERE usuario = ?', id);
    const dict_send = {}
    const result = await connection.query('SELECT totalCuenta, DATE_FORMAT(FechaCompra, "%M %e %Y") as FechaCompra, id  FROM compras WHERE nombreCliente = ? ', user[0][0].nombre);
    dict_send['total'] = result[0];
    const result1 = await connection.query('SELECT totalCuenta, DATE_FORMAT(FechaCompra, "%M %e %Y") as FechaCompra, id  FROM medicamentos_por_usuarios WHERE nombreCliente = ? ', user[0][0].nombre);
    dict_send['detalle'] = result1[0];
    return dict_send
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
    const result = await connection.query('SELECT * FROM compras');
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
