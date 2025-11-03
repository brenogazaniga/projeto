const { Router } = require("express");
const { db } = require("../db");
const rotaEmail = Router();
const emailjs = require("@emailjs/browser");

rotaEmail.post("/api/email", async (req, res) => {
    try {
        const { name, time, message, title, email } = req.body;
        emailjs.send("service_fpy7xmw", "template_rjry648", {
            name: name,
            time: time,
            message: message,
            title: title,
            email: email,
        });
        res.status(201).json({ mensagem: "Email enviado com sucesso" });
    } catch (err) {
        res.status(400).json({ mensagem: "Erro ao enviar email", erro: err });
    }
});

module.exports = { rotaEmail };