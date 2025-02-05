const express = require ("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController");
const ReservaController = require("../controllers/ReservaController");

router.post("/novo", ReservaController.novaReserva);

router.get("/minhas", AuthController.verificaAutenticacao, ReservaController.minhasReservas);

router.delete("/cancelar", AuthController.verificaAutenticacao, ReservaController.cancelarReserva);

router.get("/list", AuthController.verificaAutenticacao, AuthController.verificaPermissaoAdm, ReservaController.buscarReservasPorData);

router.get('/geral', AuthController.verificaAutenticacao, AuthController.verificaPermissaoAdm, ReservaController.buscarReservasPorData);

module.exports = router

