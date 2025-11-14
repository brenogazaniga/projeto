require('dotenv').config()
const jwt = require("jsonwebtoken");
const { db } = require('./db');
const chaveSecreta = process.env.CHAVE_SECRETA;

async function seguranca(req, res, next) {
  const token = req.header("Authentication")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).send("O token de acesso é obrigatorio");
    return;
  }

  try {
    const decodificado = jwt.verify(token, chaveSecreta);
    
    const usuario = await db.usuario.findUnique({
      where: {
        id: decodificado.id
      }
    })

    if (!usuario) {
      res.status(401).send("Token de acesso inválido");
      return
    }

    req.decodificado = decodificado;
    next();
    return;
  } catch (err) {
    res.status(401).send("Token de acesso inválido");
    return;
  }
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
function redicionamento(req, res, next) {
  let token = req.header("Authentication")?.replace("Bearer ", "");

  token = token ? token : req.cookies.token

  if (!token) {
    res.redirect("/login");
    return;
  }

  try {
    const decodificado = jwt.verify(token, chaveSecreta);
    req.decodificado = decodificado;
    next();
    return;
  } catch (err) {
    res.redirect("/login");
    return;
  }
}
module.exports = { seguranca, redicionamento, chaveSecreta };
