# Backend

This is the backend server for the raffle app.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will run on port 3001 by default.

## API Endpoints

- `POST /api/raffles` - Create a new raffle
  - Body: `{ name: string, participants: Array<{name, email}>, categories: Array<string> }`
  - Returns: Raffle details with assigned categories and access codes

- `GET /api/raffles/:id` - Get raffle details
  - Returns: Raffle information including all participants and categories

- `GET /api/result/:code` - Get participant result by access code
  - Returns: Participant name, assigned category, and access code

## Database

The app uses SQLite and creates a `raffle.db` file automatically with the following tables:
- `raffles` - Stores raffle information
- `participants` - Stores participant details and assigned categories
- `categories` - Stores available categories for each raffle
