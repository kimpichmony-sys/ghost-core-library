import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type {
  Book,
  BookMeta,
  Chapter,
  LatestChapter,
  Series,
  SeriesMeta,
} from "@/lib/types";

const seriesDirectory = path.join(process.cwd(), "content", "series");

function fileExists(filePath: string) {
  return fs.existsSync(filePath);
}

function getDirectoryNames(directoryPath: string) {
  if (!fileExists(directoryPath)) {
    return [];
  }

  return fs
    .readdirSync(directoryPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

function readJsonFile<T>(filePath: string): T | null {
  if (!fileExists(filePath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function chapterSlugFromFileName(fileName: string) {
  return fileName.replace(/\.md$/, "");
}

function getSeriesFolder(seriesSlug: string) {
  return path.join(seriesDirectory, seriesSlug);
}

function getBooksFolder(seriesSlug: string) {
  return path.join(getSeriesFolder(seriesSlug), "books");
}

function getBookFolderByPublicSlug(seriesSlug: string, bookSlug: string) {
  return getDirectoryNames(getBooksFolder(seriesSlug)).find((directorySlug) => {
    const meta = readJsonFile<BookMeta>(
      path.join(getBooksFolder(seriesSlug), directorySlug, "meta.json"),
    );

    return meta?.bookSlug === bookSlug;
  });
}

function readSeriesMeta(seriesSlug: string) {
  return readJsonFile<SeriesMeta>(
    path.join(getSeriesFolder(seriesSlug), "series.json"),
  );
}

function readBookMeta(seriesSlug: string, directorySlug: string) {
  return readJsonFile<BookMeta>(
    path.join(getBooksFolder(seriesSlug), directorySlug, "meta.json"),
  );
}

export function getChaptersByBookSlug(
  seriesSlug: string,
  bookSlug: string,
): Chapter[] {
  const directorySlug = getBookFolderByPublicSlug(seriesSlug, bookSlug);

  if (!directorySlug) {
    return [];
  }

  const chaptersDirectory = path.join(
    getBooksFolder(seriesSlug),
    directorySlug,
    "chapters",
  );

  if (!fileExists(chaptersDirectory)) {
    return [];
  }

  return fs
    .readdirSync(chaptersDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const filePath = path.join(chaptersDirectory, fileName);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug: chapterSlugFromFileName(fileName),
        title: String(data.title ?? "Untitled Chapter"),
        chapter: Number(data.chapter ?? 0),
        date: String(data.date ?? ""),
        content,
      };
    })
    .sort((first, second) => first.chapter - second.chapter);
}

export function getBooksBySeriesSlug(seriesSlug: string): Book[] {
  return getDirectoryNames(getBooksFolder(seriesSlug))
    .map((directorySlug) => {
      const meta = readBookMeta(seriesSlug, directorySlug);

      if (!meta) {
        return null;
      }

      return {
        ...meta,
        directorySlug,
        chapters: getChaptersByBookSlug(seriesSlug, meta.bookSlug),
      };
    })
    .filter((book): book is Book => book !== null)
    .sort((first, second) => first.bookNumber - second.bookNumber);
}

export function getAllSeries(): Series[] {
  return getDirectoryNames(seriesDirectory)
    .map((seriesSlug) => {
      const meta = readSeriesMeta(seriesSlug);

      if (!meta) {
        return null;
      }

      return {
        ...meta,
        books: getBooksBySeriesSlug(meta.slug),
      };
    })
    .filter((series): series is Series => series !== null)
    .sort((first, second) => first.title.localeCompare(second.title));
}

export function getSeriesBySlug(seriesSlug: string): Series | null {
  const meta = readSeriesMeta(seriesSlug);

  if (!meta) {
    return null;
  }

  return {
    ...meta,
    books: getBooksBySeriesSlug(seriesSlug),
  };
}

export function getBookBySlug(seriesSlug: string, bookSlug: string): Book | null {
  const directorySlug = getBookFolderByPublicSlug(seriesSlug, bookSlug);

  if (!directorySlug) {
    return null;
  }

  const meta = readBookMeta(seriesSlug, directorySlug);

  if (!meta) {
    return null;
  }

  return {
    ...meta,
    directorySlug,
    chapters: getChaptersByBookSlug(seriesSlug, bookSlug),
  };
}

export function getChapterBySlug(
  seriesSlug: string,
  bookSlug: string,
  chapterSlug: string,
): Chapter | null {
  return (
    getChaptersByBookSlug(seriesSlug, bookSlug).find(
      (chapter) => chapter.slug === chapterSlug,
    ) ?? null
  );
}

export function getPreviousAndNextChapter(
  seriesSlug: string,
  bookSlug: string,
  chapterSlug: string,
) {
  const books = getBooksBySeriesSlug(seriesSlug);
  const currentBookIndex = books.findIndex((book) => book.bookSlug === bookSlug);

  if (currentBookIndex === -1) {
    return {
      previous: null,
      next: null,
    };
  }

  const currentBook = books[currentBookIndex];
  const currentChapterIndex = currentBook.chapters.findIndex(
    (chapter) => chapter.slug === chapterSlug,
  );

  if (currentChapterIndex === -1) {
    return {
      previous: null,
      next: null,
    };
  }

  const previousChapter = currentBook.chapters[currentChapterIndex - 1];
  const nextChapter = currentBook.chapters[currentChapterIndex + 1];
  const previousBook = books[currentBookIndex - 1];
  const nextBook = books[currentBookIndex + 1];

  return {
    previous: previousChapter
      ? { bookSlug: currentBook.bookSlug, chapter: previousChapter }
      : previousBook?.chapters.length
        ? {
            bookSlug: previousBook.bookSlug,
            chapter: previousBook.chapters[previousBook.chapters.length - 1],
          }
        : null,
    next: nextChapter
      ? { bookSlug: currentBook.bookSlug, chapter: nextChapter }
      : nextBook?.chapters.length
        ? { bookSlug: nextBook.bookSlug, chapter: nextBook.chapters[0] }
        : null,
  };
}

export function getLatestChapters(limit = 8): LatestChapter[] {
  return getAllSeries()
    .flatMap((series) =>
      series.books.flatMap((book) =>
        book.chapters.map((chapter) => ({
          seriesSlug: series.slug,
          seriesTitle: series.title,
          bookSlug: book.bookSlug,
          bookTitle: book.title,
          bookNumber: book.bookNumber,
          chapterSlug: chapter.slug,
          chapterTitle: chapter.title,
          chapterNumber: chapter.chapter,
          date: chapter.date,
        })),
      ),
    )
    .sort((first, second) => {
      const dateComparison = second.date.localeCompare(first.date);
      return (
        dateComparison ||
        second.bookNumber - first.bookNumber ||
        second.chapterNumber - first.chapterNumber
      );
    })
    .slice(0, limit);
}
