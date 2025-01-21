const prisma = require('../prisma/prismaClient');

class MesaController {
    static async novaMesa(req, res) {
        return res.json({ mensagem: "Mesa criada com sucesso!" });
}
}

module.exports = MesaController;