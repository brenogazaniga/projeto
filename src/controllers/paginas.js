const { Router } = require("express");
const { db } = require("../db");
const path = require("path");
const rotaPaginas = Router();

rotaPaginas.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "../../pages/TelaIntrodutoria.html"));
});

rotaPaginas.get("/login", async (req, res) => {
  res.sendFile(path.join(__dirname, "../../pages/TelaDeLogin.html"));
});

rotaPaginas.get("/cadastro", async (req, res) => {
  res.sendFile(path.join(__dirname, "../../pages/TelaCadastro.html"));
});

rotaPaginas.get("/suporte", async (req, res) => {
  res.sendFile(path.join(__dirname, "../../pages/suporte.html"));
});

module.exports = {
  rotaPaginas,
};
