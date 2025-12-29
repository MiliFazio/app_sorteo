# app_sorteo
APP para sortear las categorias de los regalos

## Raffle App

A full-stack raffle application where users can create raffles, assign categories to participants randomly, and share results via email or unique access codes.

### Tech Stack

- **Frontend**: React.js with TailwindCSS
- **Backend**: Node.js with Express
- **Database**: SQLite
- **Email**: Nodemailer

### Features

1. **Create Raffles**: Organizers can input participant names, emails, and categories
2. **Random Assignment**: Categories are randomly assigned to participants
3. **Preview Results**: Organizers can preview assignments before sending
4. **Email Notifications**: Participants receive their results via email
5. **Access Codes**: Each participant gets a unique code to view their result
6. **Result Page**: Participants can enter their code to view their assigned category

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

### Configuration

For email functionality, create a `.env` file in the backend directory:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Usage

1. Navigate to the frontend at `http://localhost:3000`
2. Create a new raffle by entering:
   - Raffle name
   - Participant names and emails
   - Categories (items to raffle)
3. Click "Create Raffle" to generate random assignments
4. Preview the results
5. Send emails to participants (optional)
6. Participants can access their results using their unique code

### Database Schema

- **raffles**: Stores raffle information
- **participants**: Stores participant details and assigned categories
- **categories**: Stores available categories for each raffle

