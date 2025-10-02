const { Router } = require("express");
const { db } = require("../db");
const rotaUsuario = Router();

rotaUsuario.get("/usuarios", async (req, res) => {
  const usuarios = await db.usuario.findMany();
  res.send(usuarios);
});

rotaUsuario.post("/usuarios", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const novo_usuario = await db.usuario.create({
      data: {
        nome,
        email,
        senha,
      },
    });
    res
      .status(201)
      .json({ mensagem: "Usuario criado com sucesso", id: novo_usuario.id });
  } catch (err) {
    res.status(400).json({ menssagem: "Erro ao criar usuario", erro: err });
  }
});

rotaUsuario.put("/usuarios/:id", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const id = req.params;

    const data = {};
    if (nome) data.nome = nome;
    if (email) data.email = email;
    if (senha) data.senha = senha;

    await db.usuario.update({
      where: { id },
      data,
    });
    res.status(200).json({ mensagem: "Usuario atualizado com sucesso!" });
  } catch (err) {
    res.status(400).json({ mensagem: "Erro ao atualizar usuario", erro: err });
  }
});

module.exports = { rotaUsuario };
