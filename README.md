# app_sorteo
APP para sortear las categorias de los regalos

## Raffle App

A full-stack raffle application where users can create raffles, assign categories to participants randomly, and share results via unique access codes.

### Tech Stack

- **Frontend**: React.js with TailwindCSS
- **Backend**: Node.js with Express
- **Database**: SQLite

### Features

1. **Create Raffles**: Organizers can input participant names and categories
2. **Random Assignment**: Categories are randomly assigned to participants
3. **View Results**: Organizers can see assignments with access codes
4. **Access Codes**: Each participant gets a unique code to view their result
5. **Result Page**: Participants can enter their code to view their assigned category

### Setup

#### Backend

```bash
cd backend
npm install
npm start
```

The backend will run on `http://localhost:3001`

#### Frontend

```bash
cd frontend
npm install
npm start
```

The frontend will run on `http://localhost:3000`

### Usage

1. Navigate to the frontend at `http://localhost:3000`
2. Create a new raffle by entering:
   - Raffle name
   - Participant names
   - Categories (items to raffle)
3. Click "Create Raffle" to generate random assignments
4. View the results with access codes for each participant
5. Share the access codes with participants
6. Participants can access their results at `/access` using their unique code

### Database Schema

- **raffles**: Stores raffle information
- **participants**: Stores participant details and assigned categories
- **categories**: Stores available categories for each raffle


