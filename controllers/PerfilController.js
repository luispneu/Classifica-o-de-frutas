const prisma = require('../prisma/prismaClient');

class PerfilController{
    static async verMeuPerfil(req, res) {
        const usuarioId = req.usuarioId;
    
        try {
          const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioId },
            select: {
              id: true,
              nome: true,
              email: true,
              tipo: true,
              createdAt: true,
              updatedAt: true,
            },
          });
    
          if (!usuario) {
            return res.status(404).json({
              mensagem: "Usuário não encontrado.",
              erro: true,
            });
          }
    
          res.status(200).json({
            mensagem: "Perfil encontrado com sucesso!",
            erro: false,
            usuario,
          });
        } catch (error) {
          res.status(500).json({
            mensagem: "Erro ao buscar o perfil.",
            erro: true,
          });
        }
      }
    
      static async atualizarMeuPerfil(req, res) {
        const usuarioId = req.usuarioId;
        const { nome, email } = req.body.usuario;
    
        if (!nome || !email) {
          return res.status(422).json({
            mensagem: "Nome e email são obrigatórios.",
            erro: true,
          });
        }
    
        try {
          const usuarioAtualizado = await prisma.usuario.update({
            where: { id: usuarioId },
            data: { nome, email },
            select: {
              id: true,
              nome: true,
              email: true,
              tipo: true,
              createdAt: true,
              updatedAt: true,
            },
          });
    
          res.status(200).json({
            mensagem: "Perfil atualizado com sucesso!",
            erro: false,
            usuario: usuarioAtualizado,
          });
        } catch (error) {
          res.status(500).json({
            mensagem: "Erro ao atualizar o perfil.",
            erro: true,
          });
        }
      }
    
      static async buscarUsuarios(req, res) {
        try {
          const usuarios = await prisma.usuario.findMany({
            select: {
              id: true,
              nome: true,
              email: true,
              tipo: true,
              createdAt: true,
              updatedAt: true,
            },
          });
    
          res.status(200).json({
            mensagem: "Usuários encontrados com sucesso!",
            erro: false,
            usuarios,
          });
        } catch (error) {
          res.status(500).json({
            mensagem: "Erro ao buscar os usuários.",
            erro: true,
          });
        }
      }
    }
    

module.exports = PerfilController;