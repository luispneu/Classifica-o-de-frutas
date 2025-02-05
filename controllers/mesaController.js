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
      const mesaExistente = await prisma.mesa.findUnique({
        where: { codigo },
      });
  
      if (mesaExistente) {
        return res.status(400).json({
          mensagem: `Já existe uma mesa com o código ${codigo}. Por favor, insira um código único.`,
          erro: true,
        });
      }
  
      const novaMesa = await prisma.mesa.create({
        data: {
          codigo,
          n_lugares: parseInt(n_lugares),
        },
      });
  
      res.status(201).json({
        mensagem: "Mesa cadastrada com sucesso!",
        erro: false,
        mesa: novaMesa,
      });
    } catch (error) {
      console.error("Erro ao cadastrar mesa:", error);
      res.status(500).json({
        mensagem: "Erro ao cadastrar a mesa.",
        erro: true,
      });
    }
  }
  static async atualizarMesa(req, res) {
    const { id, codigo, n_lugares } = req.body;
  
    if (!id || !codigo || !n_lugares) {
      return res.status(400).json({
        mensagem: "ID, código e número de lugares são obrigatórios.",
        erro: true,
      });
    }
  
    try {
      const mesaExistente = await prisma.mesa.findUnique({
        where: { id },
      });
  
      if (!mesaExistente) {
        return res.status(404).json({
          mensagem: "Mesa não encontrada.",
          erro: true,
        });
      }
  
      const mesaAtualizada = await prisma.mesa.update({
        where: { id },
        data: {
          codigo,
          n_lugares: parseInt(n_lugares),
        },
      });
  
      res.status(200).json({
        mensagem: "Mesa atualizada com sucesso!",
        erro: false,
        mesa: mesaAtualizada,
      });
    } catch (error) {
      console.error("Erro ao atualizar mesa:", error);
      res.status(500).json({
        mensagem: "Erro ao atualizar a mesa.",
        erro: true,
      });
    }
  }


  static async buscarMesas(req, res) {
    try {
      const mesas = await prisma.mesa.findMany({
        include: {
          reservas: true,
        },
      });
  
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
      return res.status(400).json({
        mensagem: "A data é obrigatória.",
        erro: true,
      });
    }

    try {
      const dataReserva = new Date(data).toISOString();

      const mesas = await prisma.mesa.findMany({
        include: {
          reservas: {
            where: {
              data: dataReserva,
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
      console.error("Erro ao consultar disponibilidade:", error);
      res.status(500).json({
        mensagem: "Erro ao consultar a disponibilidade.",
        erro: true,
      });
    }
  }
}

module.exports = MesaController;