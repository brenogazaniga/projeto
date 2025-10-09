const { Router } = require("express");
const { db } = require("../db");

const rotaLogin = Router();

rotaLogin.post("/api/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    // procura usuário com email e senha iguais
    const usuario = await db.usuario.findFirst({
      where: { email },
    });

    if (!usuario) {
      res.json({ sucesso: false, mensagem: "Usuario ou Senha invalidos" });
      return;
    }

    if (usuario.senha !== senha) {
      res.json({ sucesso: false, mensagem: "Usuario ou Senha invalidos" });
      return;
    }

    res.json({ sucesso: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ sucesso: false });
  }
});

module.exports = { rotaLogin };
