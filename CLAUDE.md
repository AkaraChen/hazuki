# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hazuki is a photo gallery website showcasing images of "反田叶月" (Hazuki Handa, a Japanese content creator). Built with React 19, TypeScript, and Vite.

## Common Commands

```sh
pnpm dev          # Start development server with hot reload
pnpm build        # Type-check, generate images.json, and build for production
pnpm preview      # Preview production build locally
pnpm generate-images  # Regenerate images.json from content directory
pnpm type-check   # Run TypeScript type checking
pnpm lint         # Run Biome linter with auto-fix
pnpm format       # Format source files with Biome
```

## Development Workflow

### Adding New Images
1. Add JPG images to the `content/` directory
2. Run `pnpm generate-images` to update `src/images.json` with metadata
3. The build will automatically optimize images via sharp

### Image Optimization
- Images are optimized at build time via `vite-plugin-compress.ts` using sharp (mozjpeg, 80% quality)
- Run `pnpm build` to trigger optimization

## Architecture

- **Entry Point**: `src/main.tsx`
- **Main Component**: `src/App.tsx` - handles image loading, shuffling, infinite scroll, and lightbox
- **Custom Hooks**: `src/hooks/useLoadMore.ts` (pagination), `src/hooks/useOnScrollToEnd.ts` (scroll detection)
- **Gallery**: Uses `react-photo-album` for masonry layout and `yet-another-react-lightbox` for full-screen viewing
- **Styling**: CSS with CSS variables for theming; auto-detects system dark mode preference

## Path Alias

`@/` maps to `./src/` (configured in `tsconfig.app.json` and `vite.config.ts`)

## Tech Stack

- React 19 + TypeScript 5.8 + Vite 6
- Biome 1.9 for linting/formatting
- sharp for image processing
