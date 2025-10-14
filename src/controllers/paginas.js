const { Router } = require("express");
const { db } = require("../db");
const path = require("path");
const { redicionamento } = require("../auth");
const rotaPaginas = Router();

rotaPaginas.get("/", redicionamento, async (req, res) => {
  res.sendFile(path.join(__dirname, "../../pages/TelaIntrodutoria.html"));
});

rotaPaginas.get("/login", redicionamento, async (req, res) => {
  res.sendFile(path.join(__dirname, "../../pages/TelaDeLogin.html"));
});

rotaPaginas.get("/cadastro", redicionamento, async (req, res) => {
  res.sendFile(path.join(__dirname, "../../pages/TelaCadastro.html"));
});

rotaPaginas.get("/suporte", redicionamento, async (req, res) => {
  res.sendFile(path.join(__dirname, "../../pages/suporte.html"));
});

rotaPaginas.get("/sugestoes", redicionamento, async (req, res) => {
  res.sendFile(path.join(__dirname, "../../pages/chatia.html"));
});

rotaPaginas.get("/cadastrar-horas", redicionamento, async (req, res) => {
  res.sendFile(path.join(__dirname, "../../pages/TelaCdastroHoras.html"));
});

rotaPaginas.get("/estatisticas-gerais", redicionamento, async (req, res) => {
  res.sendFile(path.join(__dirname, "../../pages/TelaMostrarGrafico.html"));
});

rotaPaginas.get("/configuracoes", redicionamento, async (req, res) => {
  res.sendFile(path.join(__dirname, "../../pages/configs.html"));
});

module.exports = {
  rotaPaginas,
};
