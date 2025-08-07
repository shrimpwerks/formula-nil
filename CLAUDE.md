# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `bun run dev` (uses Bun to serve index.html directly)
- **Install dependencies**: `bun install`

## Architecture Overview

Formula Nil is a React-based racing simulation that renders animated Formula 1-style cars racing around a procedurally generated track using PixiJS.

### Key Components

- **App.tsx**: Main component containing the entire racing simulation logic
  - Procedural F1 track generation with realistic features (straights, hairpins, chicanes)
  - Car animation system with individual speed and positioning
  - PixiJS integration for hardware-accelerated rendering

### Technology Stack

- **Runtime**: Bun (for development server and package management)
- **Frontend**: React 18 with TypeScript
- **Graphics**: PixiJS 8.x with @pixi/react bindings
- **Build Tool**: Vite with React plugin
- **Type Checking**: TypeScript with strict mode enabled

### Code Structure

The application is structured as a single-page React app with all racing logic contained in App.tsx. The track generation algorithm creates realistic F1 circuit features with randomized variations for each session. Cars move along interpolated paths with individual speeds and colors.

Main entry point is src/main.tsx which renders the App component into the root div defined in index.html.
