# Rental Connect

A platform connecting landlords and renters to discover and connect with each other.

## Features

- **Dual User Types**: Separate experiences for landlords and renters
- **Property Listings**: Landlords can post properties, renters can browse
- **Search & Filters**: Find properties by location, price, amenities
- **User Profiles**: Detailed profiles for both user types
- **Messaging**: Direct communication between landlords and renters
- **Favorites**: Renters can save properties they're interested in

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB (or PostgreSQL - configurable)
- **Authentication**: JWT-based auth

## Getting Started

1. Start MongoDB with Docker:
```bash
docker-compose up -d
```

2. Install dependencies:
```bash
npm run install-all
```

3. Set up environment variables (see `.env.example` files)

4. Run development servers:
```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Docker Commands

- Start MongoDB: `docker-compose up -d`
- Stop MongoDB: `docker-compose down`
- View logs: `docker-compose logs -f`
- Reset database: `docker-compose down -v` (removes all data)

## Project Structure

```
├── client/          # React frontend
├── server/          # Express backend
└── shared/          # Shared types and utilities
```
