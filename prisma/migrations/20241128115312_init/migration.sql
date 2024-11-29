-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
