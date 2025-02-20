-- CreateTable
CREATE TABLE "Vocabulary" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "englishWord" TEXT NOT NULL,
    "myanmarMeaning" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "speech" TEXT NOT NULL,
    "activityId" INTEGER NOT NULL,
    CONSTRAINT "Vocabulary_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
