-- CreateTable
CREATE TABLE "MultipleChoice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "otherWords" TEXT NOT NULL,
    "image" TEXT,
    "testId" INTEGER NOT NULL,
    CONSTRAINT "MultipleChoice_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
