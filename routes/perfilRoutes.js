const express = require ("express");
const router = express.Router();

const perfilController = require("../controllers/perfilController");

router.get("/", perfilController.getPerfil);

router.patch("/", perfilController.atualizaPerfil);

module.exports = router

