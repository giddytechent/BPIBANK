CREATE TABLE "TransactionAudit" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "actorUserId" TEXT,
    "previousAmount" INTEGER NOT NULL,
    "newAmount" INTEGER NOT NULL,
    "previousStatus" "TransactionStatus" NOT NULL,
    "newStatus" "TransactionStatus" NOT NULL,
    "previousCreatedAt" TIMESTAMP(3) NOT NULL,
    "newCreatedAt" TIMESTAMP(3) NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransactionAudit_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TransactionAudit_transactionId_changedAt_idx"
ON "TransactionAudit"("transactionId", "changedAt");

CREATE INDEX "TransactionAudit_actorUserId_idx"
ON "TransactionAudit"("actorUserId");

ALTER TABLE "TransactionAudit"
ADD CONSTRAINT "TransactionAudit_transactionId_fkey"
FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TransactionAudit"
ADD CONSTRAINT "TransactionAudit_actorUserId_fkey"
FOREIGN KEY ("actorUserId") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
