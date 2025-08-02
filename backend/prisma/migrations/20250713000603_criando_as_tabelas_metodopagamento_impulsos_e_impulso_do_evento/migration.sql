-- CreateTable
CREATE TABLE "metodos_pagamento" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "metodos_pagamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Impulso" (
    "id" TEXT NOT NULL,
    "valor" DECIMAL(65,30) NOT NULL,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metodo_pagamento_id" TEXT NOT NULL,

    CONSTRAINT "Impulso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "impulsos_eventos" (
    "id" TEXT NOT NULL,
    "valor" DECIMAL(65,30) NOT NULL,
    "data_hora_inicio" TIMESTAMP(3) NOT NULL,
    "data_fim" TIMESTAMP(3) NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "evento_id" TEXT NOT NULL,
    "impulso_id" TEXT NOT NULL,

    CONSTRAINT "impulsos_eventos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Impulso" ADD CONSTRAINT "Impulso_metodo_pagamento_id_fkey" FOREIGN KEY ("metodo_pagamento_id") REFERENCES "metodos_pagamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "impulsos_eventos" ADD CONSTRAINT "impulsos_eventos_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "impulsos_eventos" ADD CONSTRAINT "impulsos_eventos_impulso_id_fkey" FOREIGN KEY ("impulso_id") REFERENCES "Impulso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
