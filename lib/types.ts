export type PublicationStatus = "Ongoing" | "Completed";

export type SeriesMeta = {
  title: string;
  slug: string;
  author: string;
  status: PublicationStatus;
  genres: string[];
  description: string;
  cover: string;
  banner?: string;
};

export type BookMeta = {
  title: string;
  bookNumber: number;
  bookSlug: string;
  status: PublicationStatus;
  description: string;
  cover: string;
  banner?: string;
  releaseDate: string;
};

export type Chapter = {
  slug: string;
  title: string;
  chapter: number;
  date: string;
  content: string;
};

export type Book = BookMeta & {
  directorySlug: string;
  chapters: Chapter[];
};

export type Series = SeriesMeta & {
  books: Book[];
};

export type LatestChapter = {
  seriesSlug: string;
  seriesTitle: string;
  bookSlug: string;
  bookTitle: string;
  bookNumber: number;
  chapterSlug: string;
  chapterTitle: string;
  chapterNumber: number;
  date: string;
};

export type ReadingProgress = {
  seriesSlug: string;
  bookSlug: string;
  chapterSlug: string;
  chapterNumber: number;
  chapterTitle: string;
  timestamp: number;
};
