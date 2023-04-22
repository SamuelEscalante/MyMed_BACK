const mysql = require('mysql2/promise');
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'inventariomymed'
});
async function traermedicamentos() {
    const result = await connection.query('select * from medicamentos');
    return result
}
async function traermedicamento(ID_MEDICAMENTO) {
    const result = await connection.query('SELECT * FROM medicamentos WHERE ID_MEDICAMENTO = ? ', [ID_MEDICAMENTO]);
    return result;
}
async function actualizarmedicamento(ID_MEDICAMENTO, INVENTARIO) {
    const result = await connection.query('UPDATE medicamentos SET INVENTARIO = ? WHERE ID_MEDICAMENTO = ? ', [INVENTARIO, ID_MEDICAMENTO]);
    const id = await connection.query('SELECT DESCRIPCION, INVENTARIO FROM  medicamentos WHERE ID_MEDICAMENTO = ? ', [ID_MEDICAMENTO]);
    const exist_notification = await connection.query('SELECT id, ID_MEDICAMENTO, INVENTARIO FROM notificaciones WHERE ID_MEDICAMENTO = ?', [ID_MEDICAMENTO]);
    if (id[0][0].INVENTARIO <= 10) {
	console.log('1');
        if (exist_notification[0][0] !== undefined) {
	    const delete_notification = await connection.query('DELETE FROM notificaciones WHERE id = ?', [exist_notification[0][0].id]);
	}
	const date_currently = new Date(new Date().setHours(new Date().getHours() -5));
        const result2 = await connection.query('INSERT INTO notificaciones VALUES (null, ?, ?, ?, ?)', [ID_MEDICAMENTO, id[0][0].DESCRIPCION, id[0][0].INVENTARIO, date_currently]);
    } else if (exist_notification[0][0] !== undefined) {
	 const delete_notification = await connection.query('DELETE FROM notificaciones WHERE id = ?', [exist_notification[0][0].id]);
    }
    return result;
}
async function crearmedicamento(DESCRIPCION, PRECIO_UNITARIO, INVENTARIO) {
    const result = await connection.query('INSERT INTO medicamentos VALUES(null,?,?,?)', [DESCRIPCION, PRECIO_UNITARIO, INVENTARIO]);
    return result;
}
module.exports = {
    traermedicamentos, traermedicamento, actualizarmedicamento, crearmedicamento
};
