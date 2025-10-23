const { Router } = require("express");
const { db } = require("../db");
const { seguranca } = require("../auth");
const rotaMetrica = Router();


rotaMetrica.get("/metricas", async (req, res) => {
  const metricas = await db.metricas_diarias.findMany();
  res.send(metricas);
});

rotaMetrica.get("/metricas/usuario", seguranca, async (req, res) => {
  const metricas = await db.metricas_diarias.findMany({
    where: {
      id_usuario: req.decodificado.id
    }
  });
  res.send(metricas);
});


rotaMetrica.post("/metricas", seguranca, async (req, res) => {
  try {
    const {
      id,
      horas_lazer,
      horas_sono,
      horas_trabalho,
    } = req.body;
    console.log({horas_lazer});
    
    const nova_metrica = await db.metricas_diarias.create({
      data: {
        id,
        horas_lazer,
        horas_sono,
        horas_trabalho,
        usuario: {
          connect: {
            id: Number(req.decodificado.id),
          },
        },
      },
    });
    res.status(201).json({
      mensagem: "Metrica adicionada com sucesso",
      id: nova_metrica.id,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ menssagem: "Erro ao adicionar métrica", erro: err });
  }
});

rotaMetrica.put("/metricas/:id", async (req, res) => {
  try {
    const {
      horas_lazer,
      horas_sono,
      horas_trabalho,
      id_usuario,
      usuario,
      timestamp,
      nota_refeicao,
    } = req.body;
    const id = req.params;

    const data = {};
    if (horas_lazer) data.horas_lazer = horas_lazer;
    if (horas_sono) data.horas_sono = horas_sono;
    if (horas_trabalho) data.horas_trabalho = horas_trabalho;
    if (id_usuario) data.id_usuario = id_usuario;
    if (usuario) data.usuario = usuario;
    if (timestamp) data.timestamp = timestamp;
    if (nota_refeicao) data.nota_refeicao = nota_refeicao;

    await db.metricas_diarias.update({
      where: { id },
      data,
    });
    res.status(200).json({ mensagem: "Métrica atualizada com sucesso!" });
  } catch (err) {
    res.status(400).json({ mensagem: "Erro ao atualizar métricas", erro: err });
  }
});
module.exports = { rotaMetrica };
