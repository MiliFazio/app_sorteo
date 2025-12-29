# Backend

This is the backend server for the raffle app.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure email (optional):
Create a `.env` file with:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

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
- `GET /api/raffles/:id` - Get raffle details
- `GET /api/result/:code` - Get participant result by access code
- `POST /api/send-emails` - Send emails to all participants
