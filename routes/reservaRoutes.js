const express = require ("express");
const router = express.Router();

const ReservaController = require("../controllers/ReservaController");
const AuthController = require("../controllers/AuthController");

router.post("/nova", ReservaController.registrarReserva);

module.exports = router

