-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Metricas_diarias" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "horas_lazer" INTEGER NOT NULL,
    "horas_sono" INTEGER NOT NULL,
    "horas_trabalho" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Metricas_diarias_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Conversas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_usuario" INTEGER NOT NULL,
    CONSTRAINT "Conversas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mensagens" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "texto" TEXT NOT NULL,
    "id_conversa" INTEGER NOT NULL,
    "eh_ia" BOOLEAN NOT NULL,
    CONSTRAINT "Mensagens_id_conversa_fkey" FOREIGN KEY ("id_conversa") REFERENCES "Conversas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Conversas_id_usuario_key" ON "Conversas"("id_usuario");
