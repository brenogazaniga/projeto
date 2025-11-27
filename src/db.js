const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();
const variaveis = {}

module.exports = { db, variaveis };