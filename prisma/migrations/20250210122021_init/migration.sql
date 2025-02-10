/*
  Warnings:

  - You are about to drop the column `word` on the `Quiz` table. All the data in the column will be lost.
  - Added the required column `sentence` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Quiz" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sentence" TEXT NOT NULL,
    "quizWord" TEXT NOT NULL,
    "wordSplit" BOOLEAN NOT NULL DEFAULT true,
    "image" TEXT,
    "testId" INTEGER NOT NULL,
    CONSTRAINT "Quiz_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Quiz" ("id", "image", "quizWord", "testId", "wordSplit") SELECT "id", "image", "quizWord", "testId", "wordSplit" FROM "Quiz";
DROP TABLE "Quiz";
ALTER TABLE "new_Quiz" RENAME TO "Quiz";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
