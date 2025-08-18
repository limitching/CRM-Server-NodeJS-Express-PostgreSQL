# CRM Frontend

This is the frontend application for the CRM Server built with React, TypeScript, and Material-UI.

## Features

- Modern React 18+ with TypeScript
- Material-UI (MUI) v5 for consistent design
- Redux Toolkit for state management
- React Query for server state management
- React Router for navigation
- Responsive and accessible design
- Integration with existing CRM backend API

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend server running on port 3000

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp env.example .env
```

3. Update `.env` file with your backend API URL:
```
VITE_API_BASE_URL=http://localhost:3000
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Code Quality

Lint code:
```bash
npm run lint
```

Fix linting issues:
```bash
npm run lint:fix
```

Format code:
```bash
npm run format
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components
│   ├── layout/         # Layout components
│   └── features/       # Feature-specific components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API service layer
├── store/              # Redux store
├── types/              # TypeScript types
├── utils/              # Utility functions
└── constants/          # Application constants
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
