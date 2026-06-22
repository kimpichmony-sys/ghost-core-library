# Ghost Core Library

A personal multi-book webnovel reader for the **Ghost Core Ascension** series.

Built with Next.js App Router, TypeScript, Tailwind CSS, Markdown chapter files, gray-matter, react-markdown, and browser localStorage. Version 1 has no login, comments, payments, admin dashboard, or database.

## Install Dependencies

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## Current Series Structure

```text
content/series/ghost-core-ascension/
  series.json
  books/
    book-01/
      meta.json
      chapters/
        chapter-001.md
        chapter-002.md
        ...
        chapter-020.md
```

Public URLs use the `slug` from `series.json` and the `bookSlug` from each book's `meta.json`:

```text
/series/ghost-core-ascension
/series/ghost-core-ascension/book-1
/series/ghost-core-ascension/book-1/chapter/chapter-001
```

## Add Chapters

Add new Markdown files inside the correct book:

```text
content/series/ghost-core-ascension/books/book-01/chapters/chapter-021.md
```

Use this format:

```markdown
---
title: "Chapter 21: Your Chapter Title"
chapter: 21
date: "2026-06-22"
---

Chapter text goes here.
```

Do not repeat the `# Chapter...` heading in the body if the title is already in frontmatter. Chapters are sorted by the `chapter` number.

## Add Book 2

Create:

```text
content/series/ghost-core-ascension/books/book-02/
  meta.json
  chapters/
    chapter-001.md
```

Example `meta.json`:

```json
{
  "title": "Ghost Core Ascension: Book 2",
  "bookNumber": 2,
  "bookSlug": "book-2",
  "status": "Ongoing",
  "description": "Book 2 description goes here.",
  "cover": "/covers/ghost-core-ascension/book-02-cover.png",
  "banner": "/covers/ghost-core-ascension/book-02-banner.png",
  "releaseDate": "2026-06-22"
}
```

Then add Book 2 chapter files under:

```text
content/series/ghost-core-ascension/books/book-02/chapters/
```

## Add Book 3

Repeat the same pattern:

```text
content/series/ghost-core-ascension/books/book-03/
  meta.json
  chapters/
```

Set `bookNumber` to `3` and `bookSlug` to `book-3`.

## Add the Final Book

Create the final book folder using the next book number:

```text
content/series/ghost-core-ascension/books/book-05/
  meta.json
  chapters/
```

Set the book status to `Completed` when the final book is finished. When the whole series is complete, update:

```text
content/series/ghost-core-ascension/series.json
```

Change:

```json
"status": "Completed"
```

## Update Covers

Series and book cover assets live in:

```text
public/covers/ghost-core-ascension/
```

Current files:

```text
book-01-cover.png
book-01-banner.png
banner-16x9.png
```

For Book 2, add:

```text
book-02-cover.png
book-02-banner.png
```

Then update the matching paths in the book's `meta.json`.

## Reader Settings and Progress

Reader settings and Continue Reading progress are stored in the reader's browser with localStorage.

Progress is saved by series:

```json
{
  "seriesSlug": "ghost-core-ascension",
  "bookSlug": "book-1",
  "chapterSlug": "chapter-001",
  "chapterNumber": 1,
  "chapterTitle": "Chapter 1: Broken Pulse Dog",
  "timestamp": 1782135730000
}
```

Progress is device-specific because Version 1 does not use a database.

## Deploy Changes to Vercel

The site is designed for Vercel Hobby/free hosting. It does not need a database, paid services, or deploy-time unzipping. Chapters are already stored as Markdown files in `content/series`, and covers are already stored in `public/covers`.

### 1. Run Locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Before deploying, run:

```bash
npm run build
```

### 2. Push to GitHub

Create a new empty GitHub repository, then run these commands from this project folder:

```bash
git init
git add .
git commit -m "Initial Ghost Core webnovel site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace `YOUR-USERNAME` and `YOUR-REPOSITORY` with your real GitHub username and repository name.

### 3. Import to Vercel

1. Go to `https://vercel.com/new`.
2. Choose **Import Git Repository**.
3. Select your GitHub repository.
4. Keep the framework preset as **Next.js**.
5. Keep the default settings:
   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output Directory: leave blank/default
6. Do not add any database or paid integration.

### 4. Deploy the Free .vercel.app Website

Click **Deploy**.

After deployment, Vercel gives you a free URL like:

```text
https://your-project-name.vercel.app
```

Check these pages on the deployed site:

```text
https://your-project-name.vercel.app/
https://your-project-name.vercel.app/series/ghost-core-ascension
https://your-project-name.vercel.app/series/ghost-core-ascension/book-1
https://your-project-name.vercel.app/series/ghost-core-ascension/book-1/chapter/chapter-001
```

For future updates, commit and push again:

```bash
git add .
git commit -m "Update chapters"
git push
```

Vercel will automatically rebuild and redeploy.

## Pre-Publish Checklist

```bash
npm run lint
npm run build
```

Then check:

- Home page: `http://localhost:3000`
- Series page: `http://localhost:3000/series/ghost-core-ascension`
- Book 1 page: `http://localhost:3000/series/ghost-core-ascension/book-1`
- First chapter: `http://localhost:3000/series/ghost-core-ascension/book-1/chapter/chapter-001`
- Latest chapter: `http://localhost:3000/series/ghost-core-ascension/book-1/chapter/chapter-020`
