const { Router } = require('express');
const router = Router();
const usuariosModel = require('../models/usuariosModel');

router.get('/usuarios', async (req, res) => {
    var result;
    result = await usuariosModel.traerUsuarios();
    res.json(result);
});
router.get('/listaUsuarios', async (req, res) => {
    var result;
    result = await usuariosModel.listaUsuarios();
    res.json(result);
});
router.get('/usuarios/:usuario', async (req, res) => {

    const usuario = req.params.usuario;
    var result;
    result = await usuariosModel.traerUsuario(usuario);
    res.json(result[0]);
});
router.get('/usuarios/:usuario/:password', async (req, res) => {
    const usuario = req.params.usuario;
    const password = req.params.password;
    var result;
    result = await usuariosModel.validarUsuario(usuario, password);
    res.json(result);
});
router.post('/usuarios', async (req, res) => {
    const nombre = req.body.nombre;
    const usuario = req.body.usuario;
    const password = req.body.password;
    const jefe = req.body.jefe;
    var result = await usuariosModel.crearUsuario(nombre, usuario,
        password, jefe);
    res.send("usuario creado");
});

router.delete('/usuarios/:id', async (req, res) => {
    const id = req.params.id;
    var result;
    result = await usuariosModel.borrarUsuario(id);
    return res.send("usuario borrado");
});
module.exports = router;