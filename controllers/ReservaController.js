const prisma = require("../prisma/prismaClient");

class ReservaController {
  static async novaReserva(req, res) {
    const { mesaId, n_pessoas, data } = req.body;
    const usuarioId = req.usuarioId;
  
    if (!mesaId || !n_pessoas || !data) {
      return res.status(400).json({
        mensagem: "ID da mesa, número de pessoas e data são obrigatórios.",
        erro: true,
      });
    }
  
    try {
      const dataReserva = new Date(data).toISOString();
  
      const mesa = await prisma.mesa.findUnique({
        where: { id: mesaId },
      });
  
      if (!mesa) {
        return res.status(404).json({
          mensagem: "Mesa não encontrada.",
          erro: true,
        });
      }
  
      if (parseInt(n_pessoas) > mesa.n_lugares) {
        return res.status(400).json({
          mensagem: `O número de pessoas não pode exceder ${mesa.n_lugares} lugares.`,
          erro: true,
        });
      }
  
      const reservaExistente = await prisma.reserva.findFirst({
        where: {
          mesaId,
          data: dataReserva,
        },
      });
  
      if (reservaExistente) {
        return res.status(400).json({
          mensagem: "A mesa já está reservada para a data informada.",
          erro: true,
        });
      }
  
      const novaReserva = await prisma.reserva.create({
        data: {
          data: dataReserva,
          n_pessoas: parseInt(n_pessoas),
          mesaId,
          usuarioId,
        },
      });
  
      res.status(201).json({
        mensagem: "Reserva criada com sucesso!",
        erro: false,
        reserva: novaReserva,
      });
    } catch (error) {
      console.error("Erro ao criar reserva:", error);
      res.status(503).json({
        mensagem: "Erro ao criar a reserva.",
        erro: true,
      });
    }
  }

  static async listarReservas(req, res) {
    const { data } = req.query;
    try {
      let whereClause = {};
      if (data) {
        whereClause.data = new Date(data).toISOString();
      }
      const reservas = await prisma.reserva.findMany({
        where: whereClause,
        include: {
          mesa: true,
          usuario: true,
        },
      });
      res.status(200).json({
        mensagem: "Reservas encontradas com sucesso!",
        erro: false,
        reservas,
      });
    } catch (error) {
      res.status(503).json({
        mensagem: "Erro ao buscar as reservas.",
        erro: true,
      });
    }
  }

  static async minhasReservas(req, res) {
    const usuarioId = req.usuarioId;

    try {
      const reservas = await prisma.reserva.findMany({
        where: { usuarioId },
        include: {
          mesa: true,
        },
      });

      res.status(200).json({
        mensagem: "Reservas encontradas com sucesso!",
        erro: false,
        reservas,
      });
    } catch (error) {
      console.error("Erro ao buscar reservas:", error);
      res.status(500).json({
        mensagem: "Erro ao buscar as reservas.",
        erro: true,
      });
    }
  }

  static async editarReserva(req, res) {
    const { reservaId, n_pessoas, data } = req.body;
    const usuarioId = req.usuarioId;

    if (!reservaId || !n_pessoas || !data) {
      return res.status(400).json({
        mensagem: "ID da reserva, número de pessoas e data são obrigatórios.",
        erro: true,
      });
    }

    try {
      const reserva = await prisma.reserva.findUnique({
        where: { id: reservaId },
        include: { mesa: true },
      });

      if (!reserva || reserva.usuarioId !== usuarioId) {
        return res.status(403).json({
          mensagem: "Você não tem permissão para editar esta reserva.",
          erro: true,
        });
      }

      if (parseInt(n_pessoas) > reserva.mesa.n_lugares) {
        return res.status(400).json({
          mensagem: `O número de pessoas não pode exceder ${reserva.mesa.n_lugares} lugares.`,
          erro: true,
        });
      }

      const reservaAtualizada = await prisma.reserva.update({
        where: { id: reservaId },
        data: {
          n_pessoas: parseInt(n_pessoas),
          data: new Date(data).toISOString(),
        },
      });

      res.status(200).json({
        mensagem: "Reserva atualizada com sucesso!",
        erro: false,
        reserva: reservaAtualizada,
      });
    } catch (error) {
      console.error("Erro ao editar reserva:", error);
      res.status(500).json({
        mensagem: "Erro ao editar a reserva.",
        erro: true,
      });
    }
  }

  static async cancelarReserva(req, res) {
    const { reservaId } = req.body;
    const usuarioId = req.usuarioId;

    if (!reservaId) {
      return res.status(400).json({
        mensagem: "ID da reserva é obrigatório.",
        erro: true,
      });
    }

    try {
      const reserva = await prisma.reserva.findUnique({
        where: { id: reservaId },
      });

      if (!reserva || reserva.usuarioId !== usuarioId) {
        return res.status(403).json({
          mensagem: "Você não tem permissão para cancelar esta reserva.",
          erro: true,
        });
      }

      await prisma.reserva.delete({
        where: { id: reservaId },
      });

      res.status(200).json({
        mensagem: "Reserva cancelada com sucesso!",
        erro: false,
      });
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error);
      res.status(500).json({
        mensagem: "Erro ao cancelar a reserva.",
        erro: true,
      });
    }
  }

  static async buscarReservasPorData(req, res) {
    const { data } = req.query;
    let whereClause = {};

    if (data) {
      whereClause.data = new Date(data).toISOString();
    }

    try {
      const reservas = await prisma.reserva.findMany({
        where: whereClause,
        include: {
          mesa: true,
          usuario: true,
        },
      });
      res.status(200).json({
        mensagem: "Reservas encontradas com sucesso!",
        erro: false,
        reservas,
      });
    } catch (error) {
      res.status(503).json({
        mensagem: "Erro ao buscar as reservas.",
        erro: true,
      });
    }
  }
}

module.exports = ReservaController;