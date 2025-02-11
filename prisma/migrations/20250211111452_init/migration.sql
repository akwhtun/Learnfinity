-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Quiz" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sentence" TEXT NOT NULL,
    "quizWord" TEXT NOT NULL,
    "wordSplit" INTEGER NOT NULL,
    "image" TEXT,
    "testId" INTEGER NOT NULL,
    CONSTRAINT "Quiz_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Quiz" ("id", "image", "quizWord", "sentence", "testId", "wordSplit") SELECT "id", "image", "quizWord", "sentence", "testId", "wordSplit" FROM "Quiz";
DROP TABLE "Quiz";
ALTER TABLE "new_Quiz" RENAME TO "Quiz";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
