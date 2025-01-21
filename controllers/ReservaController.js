const prisma = require('../prisma/prismaClient');

class ReservaController{
 static async registrarReserva(req, res){
    const { MesaId, n_pessoas } = req.body;
    const data = new Date(req.body.data);

    const mesa = await prisma.mesa.findUnique({
        where: {
            id: MesaId,
        },
        include: {
            reservas: {
                where: {
                    data: data,
                    status: true,
                },
            }
        },
    });

    if (mesa.reservas.length > 0) {
        return res.status(400).json({
            erro: true,
            mensagem: "Esta mesa já está reservada para esta data."
        });
    }
    prisma.reserva.create({
        data: {
            data: data,
            n_pessoas: n_pessoas,
            usuario: {
                connect: {
                    id: req.usuarioId,
                },
            },
            mesa: {
                connect: {
                    id: MesaId,
                },
            },
        },
    }).then(() => {
        return res.status(201).json({
        error: false,
        mensagem: "Reserva realizada com sucesso!"
    });
    }).catch((error) => {
        return res.status(500).json({
            erro: true,
            mensagem: "Ocorreu um erro ao realizar a reserva."
        });
    });
 }
}

module.exports = ReservaController;