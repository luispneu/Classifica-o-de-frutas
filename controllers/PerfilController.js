const prisma = require('../prisma/prismaClient');

class PerfilController{
    static async getPerfil(req, res){
        prisma.usuario.findUnique({ 
            where: 
            { id: req.usuarioId }, 
            omit:
            { password: true }
        })
    };
    
    static async atualizaPerfil(req, res){
        prisma.usuario.update({
            where: { 
            id: req.usuarioId 
        },
            data: {
            email: email,
            nome: nome,
        },
        });
    }
}

module.exports = PerfilController;