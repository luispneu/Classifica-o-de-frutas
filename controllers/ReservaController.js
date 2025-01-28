const prisma = require("../prisma/prismaClient");

class ReservaController {
  static async novaReserva(req, res) {
    const { data, n_pessoas, mesaId } = req.body;
    const usuarioId = req.usuarioId;

    if (!data || !n_pessoas || !mesaId) {
      return res.status(422).json({
        mensagem: "Data, número de pessoas e ID da mesa são obrigatórios.",
        erro: true,
      });
    }

    try {
      const mesa = await prisma.mesa.findUnique({
        where: { id: mesaId },
      });

      if (!mesa) {
        return res.status(404).json({
          mensagem: "Mesa não encontrada.",
          erro: true,
        });
      }

      const reservaExistente = await prisma.reserva.findFirst({
        where: {
          mesaId,
          data,
        },
      });

      if (reservaExistente) {
        return res.status(422).json({
          mensagem: "A mesa já está reservada para a data informada.",
          erro: true,
        });
      }

      const novaReserva = await prisma.reserva.create({
        data: {
          data,
          n_pessoas,
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
      res.status(500).json({
        mensagem: "Erro ao criar a reserva.",
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
      res.status(500).json({
        mensagem: "Erro ao buscar as reservas.",
        erro: true,
      });
    }
  }

  static async cancelarReserva(req, res) {
    const { reservaId } = req.body;
    const usuarioId = req.usuarioId;

    if (!reservaId) {
      return res.status(422).json({
        mensagem: "ID da reserva é obrigatório.",
        erro: true,
      });
    }

    try {
      const reserva = await prisma.reserva.findUnique({
        where: { id: reservaId },
      });

      if (!reserva) {
        return res.status(404).json({
          mensagem: "Reserva não encontrada.",
          erro: true,
        });
      }

      if (reserva.usuarioId !== usuarioId) {
        return res.status(403).json({
          mensagem: "Você não tem permissão para cancelar esta reserva.",
          erro: true,
        });
      }

      if (new Date(reserva.data) < new Date()) {
        return res.status(422).json({
          mensagem: "Não é possível cancelar reservas de datas passadas.",
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
      res.status(500).json({
        mensagem: "Erro ao cancelar a reserva.",
        erro: true,
      });
    }
  }

  static async buscarReservasPorData(req, res) {
    const { data } = req.query;

    if (!data) {
      return res.status(422).json({
        mensagem: "A data é obrigatória.",
        erro: true,
      });
    }

    try {
      const reservas = await prisma.reserva.findMany({
        where: { data },
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
      res.status(500).json({
        mensagem: "Erro ao buscar as reservas.",
        erro: true,
      });
    }
  }
}

module.exports = ReservaController;