const prisma = require("../prisma/prismaClient");

class MesaController {
    static async novaMesa(req, res) {
    const { codigo, n_lugares } = req.body;

    if (!codigo || !n_lugares) {
      return res.status(422).json({
        mensagem: "Código e número de lugares são obrigatórios.",
        erro: true,
      });
    }

    try {
      const novaMesa = await prisma.mesa.create({
        data: {
          codigo,
          n_lugares,
        },
      });

      res.status(201).json({
        mensagem: "Mesa cadastrada com sucesso!",
        erro: false,
        mesa: novaMesa,
      });
    } catch (error) {
      res.status(500).json({
        mensagem: "Erro ao cadastrar a mesa.",
        erro: true,
      });
    }
  }

  static async buscarMesas(req, res) {
    try {
      const mesas = await prisma.mesa.findMany();

      res.status(200).json({
        mensagem: "Mesas encontradas com sucesso!",
        erro: false,
        mesas,
      });
    } catch (error) {
      res.status(500).json({
        mensagem: "Erro ao buscar as mesas.",
        erro: true,
      });
    }
  }

  static async consultarDisponibilidade(req, res) {
    const { data } = req.query;

    if (!data) {
      return res.status(422).json({
        mensagem: "A data é obrigatória.",
        erro: true,
      });
    }

    try {
      const mesas = await prisma.mesa.findMany({
        include: {
          reservas: {
            where: {
              data,
            },
          },
        },
      });

      res.status(200).json({
        mensagem: "Disponibilidade consultada com sucesso!",
        erro: false,
        mesas,
      });
    } catch (error) {
      res.status(500).json({
        mensagem: "Erro ao consultar a disponibilidade.",
        erro: true,
      });
    }
  }
}

module.exports = MesaController;