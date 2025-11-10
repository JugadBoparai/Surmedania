# Development Setup

## Quick Start

Run both frontend and backend together:

```bash
npm run dev
```

This starts:
- 🎨 **Frontend (Vite)**: http://localhost:5173
- 🔧 **Backend (Express)**: http://localhost:4000

Output is color-coded:
- **Cyan** = Vite frontend
- **Magenta** = API backend

## Separate Commands

If you need to run them individually:

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

## Environment Variables

### Frontend (.env)
```bash
VITE_WEBHOOK_URL=http://localhost:4000/webhook
```

### Backend (server/.env)
```bash
PORT=4000
SHEET_ID=your-google-sheet-id
# ... other backend env vars
```

## Backend Setup

The backend runs automatically with `npm run dev`, but if you need to set it up separately:

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your credentials
npm start
```

## Registration Flow

1. User fills form on `/registration`
2. Frontend sends POST to `http://localhost:4000/webhook`
3. Backend saves to:
   - Google Sheets (if configured)
   - Local CSV file (fallback)
4. User redirects to `/registration/confirm` for payment

## Troubleshooting

**Backend not starting?**
- Check `server/node_modules` exists: `cd server && npm install`
- Verify port 4000 is available: `lsof -i :4000`

**Frontend can't reach backend?**
- Check `.env` has correct `VITE_WEBHOOK_URL`
- Verify backend is running: `curl http://localhost:4000/webhook`
- Check CORS is enabled in `server/index.js`

**Stop all dev servers:**
```bash
# Press Ctrl+C in the terminal where npm run dev is running
# Or kill processes manually:
pkill -f "vite|node.*server"
```
