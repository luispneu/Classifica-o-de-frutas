const express = require ("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController");
const ReservaController = require("../controllers/ReservaController");

router.post("/novo", ReservaController.registrarReserva);

router.post("/", AuthController.verificaAutenticacao, ReservaController.minhasReservas);

router.delete("/", AuthController.verificaAutenticacao, ReservaController.cancelarReserva);

router.get("/list", AuthController.verificaAutenticacao, AuthController.verificaPermissaoAdm, ReservaController.buscarReservasPorData);

module.exports = router

