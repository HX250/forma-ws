-- DropForeignKey
ALTER TABLE "client_goals" DROP CONSTRAINT "client_goals_clientId_fkey";

-- AddForeignKey
ALTER TABLE "client_goals" ADD CONSTRAINT "client_goals_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
