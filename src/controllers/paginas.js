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

rotaPaginas.get("/sugestoes", async (req, res) => {
  res.sendFile(path.join(__dirname, "../../pages/chatia.html"));
});

rotaPaginas.get("/cadastrar-horas", async (req, res) => {
  res.sendFile(path.join(__dirname, "../../pages/TelaCdastroHoras.html"));
});

rotaPaginas.get("/estatisticas-gerais", async (req, res) => {
  res.sendFile(path.join(__dirname, "../../pages/TelaMostrarGrafico.html"));
});

rotaPaginas.get("/configuracoes", async (req, res) => {
  res.sendFile(path.join(__dirname, "../../pages/configs.html"));
});

module.exports = {
  rotaPaginas,
};
