const mysql = require("mysql2/promise");
const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "inventariomymed",
});
async function traerUsuarios() {
  const result = await connection.query("SELECT * FROM usuarios");
  return result[0];
}
async function listaUsuarios() {
  const result = await connection.query("SELECT usuario FROM usuarios");
  return result[0];
}
async function traerUsuario(usuario) {
  const result = await connection.query(
    "SELECT * FROM usuarios WHERE usuario = ? ",
    usuario
  );
  return result[0];
}

async function validarUsuario(usuario, password) {
  const result = await connection.query(
    "SELECT * FROM usuarios WHERE usuario = ? AND password = ? ",
    [usuario, password]
  );
  return result[0];
}
async function crearUsuario(nombre, usuario, password, jefe) {
  const result = await connection.query(
    "INSERT INTO usuarios VALUES(?,?,?,?)",
    [nombre, usuario, password, jefe]
  );
  return result;
}
async function borrarUsuario(usuario) {
  const result = await connection.query(
    "DELETE FROM usuarios WHERE usuario = ?",
    [usuario]
  );
  return result;
}
module.exports = {traerUsuarios, traerUsuario, listaUsuarios, validarUsuario, crearUsuario, borrarUsuario,
};
