# Fortune Signals - Casino Game Signal Generator

## Overview

Fortune Signals is a full-stack web application that generates predictive signals for casino games, specifically Fortune-themed games like Fortune Rabbit and Fortune Tiger. The application features a modern casino-themed UI with real-time signal generation, statistics tracking, and a responsive design.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom casino theme
- **UI Components**: Radix UI primitives with shadcn/ui components
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: In-memory storage with interface for database abstraction
- **API**: RESTful API with JSON responses

### Build System
- **Development**: Vite dev server with HMR
- **Production**: esbuild for server bundling, Vite for client bundling
- **TypeScript**: Shared types between client and server

## Key Components

### Database Schema
- **Games Table**: Stores game information (name, display name, emoji, badges)
- **Signals Table**: Stores generated signals with strength levels, confidence scores, and results
- **Relationships**: Signals reference games via foreign key

### API Endpoints
- `GET /api/games` - Retrieve all available games
- `GET /api/games/:id` - Get specific game details
- `POST /api/signals` - Generate new signal
- `GET /api/signals/game/:gameId` - Get signals for specific game
- `GET /api/signals/recent` - Get recent signals across all games
- `GET /api/signals/stats` - Get win/loss statistics

### Frontend Pages
- **Home**: Game selection and signal generation interface
- **Signal Generator**: Real-time signal display with statistics and history

### Signal Generation Logic
- Strength levels: FRACO (1), MÉDIO (2), FORTE (3), MUITO FORTE (4)
- Confidence scoring: 1-100 scale
- Result tracking: WIN/LOSS/PENDING states
- Timer-based generation with countdown display

## Data Flow

1. **Game Selection**: User selects a Fortune game from the home page
2. **Signal Generation**: Backend generates random signals with weighted probabilities
3. **Real-time Updates**: Frontend polls for new signals and statistics
4. **Result Tracking**: Signals can be updated with WIN/LOSS results
5. **Statistics Display**: Win rates and performance metrics are calculated and displayed

## External Dependencies

### Frontend Dependencies
- React ecosystem (React, React DOM, React Router via Wouter)
- TanStack Query for data fetching
- Radix UI primitives for accessible components
- Tailwind CSS for styling
- Lucide React for icons
- Date-fns for date formatting

### Backend Dependencies
- Express for web server
- Drizzle ORM for database operations
- Neon Database serverless driver
- Zod for schema validation
- Connect-pg-simple for session storage

### Development Dependencies
- Vite for development server and bundling
- esbuild for server compilation
- TypeScript for type safety
- Tailwind CSS for styling
- PostCSS for CSS processing

## Deployment Strategy

### Development
- Vite dev server for frontend with HMR
- tsx for running TypeScript server directly
- Concurrent development with shared TypeScript configuration

### Production
- Client build: Vite builds to `dist/public`
- Server build: esbuild bundles to `dist/index.js`
- Static file serving: Express serves built client files
- Database: PostgreSQL via Neon serverless

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Environment specification

## Changelog

- July 06, 2025. Initial setup
- July 06, 2025. Enhanced signal generation with advanced features:
  - Added specific spin count recommendations for normal and turbo modes
  - Implemented profitable time slots functionality
  - Added support for multiple betting houses
  - Improved signal accuracy with detailed instructions
  - Added developer credits and contact information
- July 06, 2025. Major UI/UX Updates:
  - Changed site name/title to "KanparySinais"
  - Removed unnecessary UI elements (Terms, About, Privacy Policy, Contact links)
  - Updated footer text to "2025 - KanparySinais"
  - Removed "Important Warning" disclaimer block
  - Modified signal generation to be unlimited (removed time restrictions)
  - Added real-time tips and strategies for each signal based on advanced algorithms
  - Changed to automatic mode only based on pattern analysis
  - Removed "Compatible Betting Houses" block
  - Updated PG Soft games with Portuguese translations (removed "Sortudo" terminology)
  - Removed "Apply to Betting Houses" button
  - Improved responsive design for desktop and mobile devices
  - Added user feedback system for signal effectiveness tracking
  - Enhanced algorithm-specific strategy recommendations

## User Preferences

Preferred communication style: Simple, everyday language.
Developer: Kanpary
Contact: https://t.me//Kanpary
Language: Portuguese (all content should be in Portuguese)