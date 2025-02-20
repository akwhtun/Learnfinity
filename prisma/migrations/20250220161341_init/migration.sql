/*
  Warnings:

  - Added the required column `updatedAt` to the `MultipleChoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Test` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MultipleChoice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "otherWords" TEXT NOT NULL,
    "image" TEXT,
    "testId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MultipleChoice_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MultipleChoice" ("answer", "id", "image", "otherWords", "question", "testId") SELECT "answer", "id", "image", "otherWords", "question", "testId" FROM "MultipleChoice";
DROP TABLE "MultipleChoice";
ALTER TABLE "new_MultipleChoice" RENAME TO "MultipleChoice";
CREATE TABLE "new_Pronounciation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Pronounciation" ("createdAt", "id", "image", "text", "updatedAt") SELECT "createdAt", "id", "image", "text", "updatedAt" FROM "Pronounciation";
DROP TABLE "Pronounciation";
ALTER TABLE "new_Pronounciation" RENAME TO "Pronounciation";
CREATE TABLE "new_Quiz" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sentence" TEXT NOT NULL,
    "quizWord" TEXT NOT NULL,
    "wordSplit" INTEGER NOT NULL,
    "image" TEXT,
    "testId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Quiz_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Quiz" ("id", "image", "quizWord", "sentence", "testId", "wordSplit") SELECT "id", "image", "quizWord", "sentence", "testId", "wordSplit" FROM "Quiz";
DROP TABLE "Quiz";
ALTER TABLE "new_Quiz" RENAME TO "Quiz";
CREATE TABLE "new_Test" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Test" ("category", "description", "id", "image", "level", "title") SELECT "category", "description", "id", "image", "level", "title" FROM "Test";
DROP TABLE "Test";
ALTER TABLE "new_Test" RENAME TO "Test";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
