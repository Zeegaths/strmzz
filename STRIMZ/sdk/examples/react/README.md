# React SPA Example - Strimz SDK

This example demonstrates how to integrate Strimz payments into a React Single Page Application.

## Features

- React components and hooks
- TypeScript support
- Client-side routing with React Router
- Payment result handling

## Setup

1. Install dependencies:
```bash
npm install @strimz/sdk react react-dom react-router-dom
```

2. Set up environment variables:
```env
# .env
VITE_STRIMZ_PUBLIC_KEY=STRZtest_your_public_key
```

3. Run the development server:
```bash
npm run dev
```

## File Structure

```
src/
├── App.tsx                 # Main app with StrimzProvider
├── pages/
│   ├── Home.tsx           # Pricing page
│   └── Success.tsx        # Success page
└── main.tsx               # App entry point
```

## Usage

See the example files for implementation details.
