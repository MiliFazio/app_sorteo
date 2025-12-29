# Backend

This is the backend server for the raffle app.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure email (optional):
Copy `.env.example` to `.env` and configure your email settings:
```bash
cp .env.example .env
```

Then edit `.env` with your email credentials:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Note:** For Gmail, you need to use an [App Password](https://support.google.com/accounts/answer/185833), not your regular password.

**Email is optional:** The app works without email configuration. If not configured, users can still create raffles and access results via codes, but the "Send Emails" feature will be disabled.

3. Run the server:
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

- `POST /api/send-emails` - Send emails to all participants
  - Body: `{ raffleId: number }`
  - Requires email configuration
  - Returns: Success message or error

## Database

The app uses SQLite and creates a `raffle.db` file automatically with the following tables:
- `raffles` - Stores raffle information
- `participants` - Stores participant details and assigned categories
- `categories` - Stores available categories for each raffle
