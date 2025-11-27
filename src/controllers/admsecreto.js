const { Router } = require("express");
const { variaveis } = require("../db");
// const jwt = require("jsonwebtoken");
// const { chaveSecreta } = require("../auth");

const rotaAdmsecreto = Router();

rotaAdmsecreto.post("/api/admsecreto", async (req, res) => {
    variaveis = req.body

    res.json(variaveis) 
});

rotaAdmsecreto.get("/api/admsecreto/:token", async (req, res) => {
  variaveis.token = req.params.token;

  res.json(variaveis);
});

module.exports = { rotaAdmsecreto };
