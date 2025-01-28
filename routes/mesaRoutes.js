const express = require ("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController");
const MesaController = require("../controllers/MesaController");


router.post("/novo", AuthController.verificaAutenticacao, AuthController.verificaPermissaoAdm, MesaController.novaMesa);

router.get("/", MesaController.buscarMesas);

router.get("/disponibilidade", MesaController.consultarDisponibilidade);

module.exports = router

