# Database Setup Instructions

## Prerequisites
- Neon Postgres database account
- Firebase project with Authentication enabled
- Firebase Admin SDK service account key

## Step 1: Create Database Table

Run the migration SQL file in your Neon database console:

```bash
# Connect to your Neon database and run:
psql "your_neon_connection_string" -f database/migrations/001_create_user_impact_logs.sql
```

Or manually execute the SQL in the Neon console.

## Step 2: Configure Environment Variables

Add to your `.env.local` file:

```env
# Neon Database
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Firebase Admin (for server-side)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/firebase-service-account-key.json
```

## Step 3: Get Firebase Service Account Key

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Download the JSON file
4. Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to point to this file

Alternatively, if you're running on Google Cloud, you can use Application Default Credentials (ADC).

## Step 4: Start the Server

```bash
npm run dev
```

The API will be available at `http://localhost:5000/api/logSustainabilityAction`

## API Endpoint

### POST /api/logSustainabilityAction

**Request Body:**
```json
{
  "category": "travel",
  "actionLabel": "Walk",
  "points": 5,
  "idToken": "firebase_id_token"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

## Testing

1. Log in to your app with Firebase Auth
2. Open the Quick Actions modal
3. Select actions and click "Save Actions"
4. Check your Neon database to verify the data was inserted

## Troubleshooting

### "Invalid or expired authentication token"
- Make sure the user is logged in with Firebase Auth
- Check that the ID token is being sent correctly

### "Failed to log action"
- Verify DATABASE_URL is correct in .env.local
- Check that the user_impact_logs table exists
- Ensure Firebase Admin is properly initialized

### Connection errors
- Verify your Neon database allows connections from your IP
- Check that SSL is properly configured
