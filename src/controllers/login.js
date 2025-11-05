const { Router } = require("express");
const { db } = require("../db");
const jwt = require("jsonwebtoken");
const { chaveSecreta } = require("../auth");

const rotaLogin = Router();

rotaLogin.post("/api/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    // procura usuário com email e senha iguais
    const usuario = await db.usuario.findFirst({
      where: { email },
    });

    console.log(await db.usuario.findMany());
    console.log({ email, senha });
    console.log(usuario);

    if (!usuario) {
      res
        .status(401)
        .json({ sucesso: false, mensagem: "Usuario ou Senha invalidos" });
      return;
    }

    if (usuario.senha !== senha) {
      res
        .status(401)
        .json({ sucesso: false, mensagem: "Usuario ou Senha invalidos" });
      return;
    }

    const token = jwt.sign({ id: usuario.id }, chaveSecreta);
    res.cookie("token", `${token}`, { maxAge: 3600000, httpOnly: true }); // Mantém para autenticação segura
    res.cookie("userId", usuario.id, { maxAge: 3600000 }); // Adicione este cookie legível pelo JS
    res.json({ sucesso: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ sucesso: false });
  }
});

rotaLogin.get("/logout", async (req, res) => {
  res.clearCookie("token")
  res.clearCookie("userId")
  res.json({ "mensagem": "Cookie apagado" })

})

module.exports = { rotaLogin };
