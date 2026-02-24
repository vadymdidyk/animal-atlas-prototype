# Animal Atlas

An interactive museum companion app prototype that lets users discover and collect animals using their device's camera. Point the camera at exhibit markers to identify animals, build a personal collection, and test your knowledge with quizzes. As a prototype, the app uses the pre-trained TensorFlow.js COCO-SSD model. For simplicity, it currently supports the detection of only three animals: cat, dog, and cow. Sample images for testing are available in the `sample_images/` folder.

## Features

- **Camera Detection** — Real-time object recognition powered by TensorFlow.js (COCO-SSD) to identify animals from the camera feed
- **Collection** — Discovered animals are saved to a personal collection with detailed information pages
- **Quizzes** — Each animal entry includes an interactive quiz with hidden-word challenges
- **Timed Sessions** — Configurable session duration with countdown timer and time warnings
- **Multilingual** — Japanese and English language support
- **Sound Effects** — Audio feedback for interactions (can be toggled on/off)
- **Offline Model Caching** — ML model is cached in IndexedDB after first load for faster subsequent visits

## Tech Stack

- **React 19** with TypeScript
- **Vite** — build tool and dev server
- **Tailwind CSS v4** — styling
- **Framer Motion** — animations and page transitions
- **Redux Toolkit** — state management
- **React Router v7** — client-side routing
- **TensorFlow.js + COCO-SSD** — on-device object detection
- **i18next** — internationalization
- **localstorage-slim** — session persistence with TTL

## Project Structure

```
src/
  config/         # Centralized app configuration
  components/     # Reusable UI components
  routes/         # Page views
  hooks/          # Custom hooks
  store/          # Redux slices
  services/       # localStorage service layer
  i18n/           # Translation files and i18next setup
  data/           # Collection data definitions
  assets/         # Images, icons, and audio files
```

## Configuration

Core app parameters are centralized in `src/config/app.config.ts`:

- **Session** — duration, TTL, time warning threshold
- **Languages** — supported locales, default language, quiz symbols
- **Model** — ML model version identifier
- **Storage** — localStorage namespace keys

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```
