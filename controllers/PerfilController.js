const prisma = require("../prisma/prismaClient");

class PerfilController {
  static async verMeuPerfil(req, res) {
    const usuarioId = req.usuarioId;

    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id: usuarioId },
        select: { nome: true, email: true, tipo: true },
      });

      if (!usuario) {
        return res.status(404).json({ erro: true, mensagem: "Usuário não encontrado." });
      }

      res.status(200).json({ erro: false, usuario });
    } catch (error) {
      res.status(500).json({ erro: true, mensagem: "Erro ao buscar o perfil." });
    }
  }

  static async atualizarMeuPerfil(req, res) {
    const usuarioId = req.usuarioId;
    const { nome, email } = req.body;

    if (!nome || nome.length < 6) {
      return res.status(400).json({
        erro: true,
        mensagem: "O nome deve ter pelo menos 6 caracteres.",
      });
    }

    if (!email || email.length < 10) {
      return res.status(400).json({
        erro: true,
        mensagem: "O email deve ter pelo menos 10 caracteres.",
      });
    }

    try {
      const emailExistente = await prisma.usuario.findFirst({
        where: {
          email: email,
          NOT: {
            id: usuarioId,
          },
        },
      });

      if (emailExistente) {
        return res.status(409).json({
          erro: true,
          mensagem: "Este email já está em uso por outro usuário.",
        });
      }

      const usuarioAtualizado = await prisma.usuario.update({
        where: { id: usuarioId },
        data: { nome, email },
        select: { nome: true, email: true, tipo: true },
      });

      res.status(200).json({
        erro: false,
        mensagem: "Perfil atualizado com sucesso!",
        usuario: usuarioAtualizado,
      });
    } catch (error) {
      res.status(500).json({
        erro: true,
        mensagem: "Erro ao atualizar o perfil. Por favor, tente novamente mais tarde.",
      });
    }
  }

  static async buscarUsuarios(req, res) {
    try {
      const usuarios = await prisma.usuario.findMany({
        select: { id: true, nome: true, email: true, tipo: true },
      });

      res.status(200).json({ erro: false, usuarios });
    } catch (error) {
      res.status(500).json({ erro: true, mensagem: "Erro ao buscar os usuários." });
    }
  }
}

module.exports = PerfilController;