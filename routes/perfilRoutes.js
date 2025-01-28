const express = require ("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController");
const PerfilController = require("../controllers/PerfilController");

router.get("/", AuthController.verificaAutenticacao, PerfilController.verMeuPerfil);

router.patch("/", AuthController.verificaAutenticacao, PerfilController.atualizarMeuPerfil);

router.get("/todos", AuthController.verificaAutenticacao, AuthController.verificaPermissaoAdm, PerfilController.buscarUsuarios);

module.exports = router

