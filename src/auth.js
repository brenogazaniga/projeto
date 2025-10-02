const jwt = require("jsonwebtoken");
const chaveSecreta = "chave-secreta-do-token-123456789";

function seguranca(req, res, next) {
  const token = req.header("Authentication")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).send("O token de acesso é obrigatorio");
    return;
  }

  try {
    const decodificado = jwt.verify(token, chaveSecreta);
    req.decodificado = decodificado;
    next();
    return;
  } catch (err) {
    res.status(401).send("Token de acesso inválido");
    return;
  }
}
