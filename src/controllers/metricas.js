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
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ mensagem: "ID inválido" });
    }

    const {
      horas_lazer,
      horas_sono,
      horas_trabalho,
      id_usuario,
      usuario,
      timestamp,
      nota_refeicao,
    } = req.body;

    console.log("PUT /metricas/:id params:", req.params);
    console.log("PUT /metricas/:id body:", req.body);

    const data = {};
    if (horas_lazer !== undefined) data.horas_lazer = horas_lazer;
    if (horas_sono !== undefined) data.horas_sono = horas_sono;
    if (horas_trabalho !== undefined) data.horas_trabalho = horas_trabalho;
    if (id_usuario !== undefined) data.id_usuario = id_usuario;
    if (usuario !== undefined) data.usuario = usuario;
    if (timestamp !== undefined) data.timestamp = timestamp;
    if (nota_refeicao !== undefined) data.nota_refeicao = nota_refeicao;

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ mensagem: "Nenhum campo para atualizar" });
    }

    const updated = await db.metricas_diarias.update({
      where: { id },
      data,
    });

    return res
      .status(200)
      .json({ mensagem: "Métrica atualizada com sucesso!", updated });
  } catch (err) {
    console.error("Erro ao atualizar métricas:", err);
    if (err?.code === "P2025") {
      return res.status(404).json({ mensagem: "Métrica não encontrada" });
    }
    return res.status(500).json({
      mensagem: "Erro ao atualizar métricas",
      erro: err.message || err,
    });
  }
});

module.exports = { rotaMetrica };
