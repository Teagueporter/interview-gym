# Interview Gym

Interview Gym is a lightweight Python interview warmup app. It is designed for short, repetitive implementation drills that build fluency with common interview primitives before doing full LeetCode-style problems.

The goal is simple:

```text
Open app -> drill Python mechanics -> leave and do deeper practice
```

## Features

- Daily warmup sessions
- Python drill editor powered by Monaco
- Browser-only Python execution with Pyodide in a Web Worker
- 3-second execution timeout for infinite loop protection
- Hidden test harness feedback
- Manual confidence ratings: clean, hesitated, hard, failed
- Leitner-style spaced repetition
- Skill mastery scoring
- Local progress history
- Reference templates with direct practice links
- Export/import progress as JSON

## Tech Stack

- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- Monaco Editor
- Pyodide
- Web Workers
- localStorage persistence

## Getting Started

Install dependencies:

```bash
npm install
```

Start the local app:

```bash
npm run dev
```

Open:

[http://localhost:3010](http://localhost:3010)

Interview Gym intentionally uses port `3010` so it does not conflict with other local apps that use `3000`.

## Live App

[https://interview-gym-five.vercel.app](https://interview-gym-five.vercel.app)

## Scripts

```bash
npm run dev
```

Starts the development server on port `3010`.

```bash
npm run dev:3000
```

Starts the development server on port `3000`.

```bash
npm run build
```

Creates a production build.

```bash
npm run start:local
```

Serves the production build on port `3010` after running `npm run build`.

```bash
npm run lint
```

Runs ESLint.

## Persistence

Progress is stored locally in the browser with `localStorage`. There is no account system, database, or server-side code execution.

Use Settings -> Export Progress to back up your progress as JSON, and Settings -> Import Progress to restore it later.

## Localhost Notes

`localhost` only works while the Next.js server is running on your machine. If you close your computer or stop the terminal process, start it again with:

```bash
npm run dev
```

For a permanent public URL, deploy the app to Vercel or another Next.js host.

## Project Structure

```text
src/
  app/          App Router pages
  components/   UI and drill runner components
  data/         Drill bank and skill labels
  lib/          scheduling, scoring, storage, execution
  types/        Shared TypeScript types
  workers/      Pyodide execution worker
```

## Safety Model

User Python runs in the browser through Pyodide inside a Web Worker. The app does not send user code to a backend for execution.

When a run exceeds the timeout, the worker is terminated and recreated so infinite loops do not freeze the UI.
