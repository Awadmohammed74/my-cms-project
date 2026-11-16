# PROCMS

A professional content management system (CMS) built with modern web technologies. PROCMS provides a secure, responsive dashboard for managing articles, categories, and site settings with real-time data synchronization powered by Firebase.

## Overview

PROCMS is a full-featured admin panel that allows content administrators to create, edit, and organize articles, manage publication categories, configure site settings, and monitor content activity — all within a clean, responsive interface.

## Features

- **Authentication & Authorization** — Secure login flow with protected routes for admin access only.
- **Article Management** — Create, read, update, and delete articles with rich text-like form fields.
- **Category Management** — Organize articles into categories for better content structure.
- **Image Handling** — Upload and compress images with client-side optimization before storage.
- **Dashboard Analytics** — Overview statistics and recent activity feed for content insights.
- **Site Settings** — Configure and persist site-wide settings.
- **Responsive Design** — Fully responsive layout that works across desktop, tablet, and mobile.
- **SEO Support** — Page-level metadata management via `react-helmet-async`.
- **Real-time Data** — Firestore integration for live data synchronization.
- **User Feedback** — Toast notifications for success, error, and warning states.

## Tech Stack

| Category     | Technology                     |
| ------------ | ------------------------------ |
| Framework    | React 19                       |
| Build Tool   | Vite 5                         |
| Styling      | Tailwind CSS 4                 |
| Routing      | React Router DOM 7             |
| Backend / DB | Firebase 12 (Auth + Firestore) |
| Icons        | Lucide React                   |
| SEO          | React Helmet Async             |
| Linting      | Oxlint                         |
| Deployment   | Vercel                         |

## Visual Theme & Color Palette

PROCMS uses a consistent **Plum / Purple / Rose** visual identity. All brand colors are defined as centralized CSS variables in [`src/index.css`](src/index.css) (Tailwind CSS v4 `@theme`) and applied across the Sidebar, Navbar, Dashboard, articles, forms, buttons, cards, tables, modals, toasts, and badges.

### Brand colors

| Variable     | Hex        | Usage                                   |
| ------------ | ---------- | --------------------------------------- |
| `--color-plum`     | `#190019` | Sidebar and dark surfaces               |
| `--color-primary`  | `#2B124C` | Primary buttons and main brand elements |
| `--color-secondary`| `#522B5B` | Secondary accents and hover states      |
| `--color-accent`   | `#854F6C` | Supporting accents and icons            |
| `--color-rose`     | `#DFB6B2` | Subtle backgrounds and borders          |
| `--color-cream`    | `#FBE4D8` | Warm surface accents                    |

These are exposed as Tailwind utilities (e.g. `bg-plum`, `text-primary`, `border-rose`, `bg-cream`) and as semantic tokens (`--color-sidebar-bg`, `--color-sidebar-text`, `--color-sidebar-hover`, `--color-surface`, `--color-border-subtle`, `--color-button-primary`, `--color-button-primary-hover`, `--color-text-brand`).

Neutral slate/gray palettes are preserved for structural elements (card backgrounds, borders, body text) to keep readable contrast. Success, warning, and error states remain recognizable (toasts, form validation, danger actions).

## Prerequisites

Before running PROCMS locally, ensure you have the following:

- **Node.js** — version 18 or higher
- **npm** — version 9 or higher (comes with Node.js)
- **Firebase Project** — a Firebase project with Authentication and Cloud Firestore enabled

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Awadmohammed74/my-cms-project.git
cd my-cms-project
npm install
```

## Firebase Configuration

PROCMS uses Firebase for authentication and database services. Create a `.env` file in the project root and populate it with your Firebase project credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

> The `.env` file is included in `.gitignore` and will never be committed to version control.

### Firestore Security Rules

Review and deploy the security rules defined in [`firestore.rules`](firestore.rules) to protect your Firestore database:

```bash
firebase deploy --only firestore:rules
```

## Available Scripts

| Script            | Description                                      |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Starts the development server with hot reloading |
| `npm run build`   | Builds the production-ready application          |
| `npm run preview` | Serves the production build locally              |
| `npm run lint`    | Runs the Oxlint code quality checks              |

## Usage

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to access the application.

### Production Build

```bash
npm run build
```

The build output will be generated in the `dist/` directory, ready for deployment.

## Project Structure

```
src/
├── assets/            # Static images and media assets
├── components/          # Reusable UI components (Button, Toast, Modal, etc.)
├── context/           # React context providers (Auth, App)
├── firebase/          # Firebase initialization and configuration
├── layouts/           # Layout components (MainLayout, Navbar, Sidebar)
├── pages/             # Route-level page components
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── AllArticles.jsx
│   ├── AddArticle.jsx
│   ├── EditArticle.jsx
│   ├── SingleArticle.jsx
│   ├── Categories.jsx
│   ├── Settings.jsx
│   └── NotFound.jsx
├── utils/             # Utility functions (e.g., image compression)
├── App.jsx            # Application routing configuration
├── main.jsx           # React entry point
└── index.css          # Global styles
```

## Deployment

PROCMS is configured for deployment on [Vercel](https://vercel.com/). The included [`vercel.json`](vercel.json) handles client-side routing with a rewrite rule to `index.html`.

To deploy:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2. Import the project into Vercel.
3. Add your Firebase environment variables in the Vercel project settings.
4. Deploy.

```bash
vercel --prod
```

## Environment Variables

All Firebase credentials are loaded at build time as environment variables prefixed with `VITE_`. These are consumed in [`src/firebase/config.js`](src/firebase/config.js) and must be present for the application to function.

| Variable                            | Description                        |
| ----------------------------------- | ---------------------------------- |
| `VITE_FIREBASE_API_KEY`             | Firebase API key                   |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Firebase Authentication domain     |
| `VITE_FIREBASE_PROJECT_ID`          | Firebase project identifier        |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Firebase Storage bucket URL        |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Cloud Messaging sender ID |
| `VITE_FIREBASE_APP_ID`              | Firebase web app ID                |
| `VITE_FIREBASE_MEASUREMENT_ID`      | Firebase Analytics measurement ID  |

## License

This project is private and proprietary. All rights reserved.
