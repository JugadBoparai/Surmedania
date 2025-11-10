# Google Sheets Integration Setup Guide

This guide will help you automatically save registration data to Google Sheets.

## Overview

When a user submits the registration form, the data will be automatically appended to your Google Sheet in real-time.

## Step-by-Step Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Name it **"Surmedania Dance School"**
4. Click **"Create"**

### Step 2: Enable Google Sheets API

1. In the Google Cloud Console, make sure your new project is selected
2. Go to **"APIs & Services"** → **"Library"**
3. Search for **"Google Sheets API"**
4. Click on it and press **"Enable"**

### Step 3: Create a Service Account

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"Service Account"**
3. Fill in:
   - **Service account name**: `surmedania-webhook`
   - **Service account ID**: (auto-generated)
   - **Description**: "Backend service for registration data"
4. Click **"Create and Continue"**
5. Skip the optional steps (click **"Continue"** then **"Done"**)

### Step 4: Create and Download the Key

1. On the **Credentials** page, find your new service account
2. Click on it to open details
3. Go to the **"Keys"** tab
4. Click **"Add Key"** → **"Create new key"**
5. Choose **JSON** format
6. Click **"Create"**
7. The key file will download (e.g., `surmedania-webhook-xxxxx.json`)
8. **IMPORTANT**: Keep this file secure and private!

### Step 5: Move the Key File

Move the downloaded JSON file to a secure location:

```bash
# Create a secure directory (if needed)
mkdir -p ~/.credentials

# Move the key file
mv ~/Downloads/surmedania-webhook-*.json ~/.credentials/surmedania-sheets.json

# Secure the file (make it readable only by you)
chmod 600 ~/.credentials/surmedania-sheets.json
```

### Step 6: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it **"Surmedania Registrations"**
4. In the first sheet (Sheet1), add this header row:

```
Timestamp | Full Name | Email | Phone | Date of Birth | Member Type | Class Selection | Skill Level | Comments / Notes | Payment Amount | Payment Status
```

5. Copy the **Sheet ID** from the URL:
   - URL looks like: `https://docs.google.com/spreadsheets/d/1abc...xyz/edit`
   - The Sheet ID is the long string between `/d/` and `/edit`

### Step 7: Share the Sheet with Service Account

1. Open your JSON key file and find the `client_email` field
   - It looks like: `surmedania-webhook@project-name.iam.gserviceaccount.com`
2. In your Google Sheet, click **"Share"** button
3. Paste the service account email
4. Give it **"Editor"** access
5. **Uncheck** "Notify people" (it's a service account, not a person)
6. Click **"Share"**

### Step 8: Configure Your Server

Edit your `server/.env` file:

```bash
cd /Users/jugadboparai/Documents/Surmedania/server
nano .env
```

Add these values:

```bash
# Port for the backend server
PORT=4000

# Your Google Sheet ID (from Step 6)
SHEET_ID=your_sheet_id_here

# Path to your service account JSON key (from Step 5)
GOOGLE_CREDENTIALS_FILE=/Users/jugadboparai/.credentials/surmedania-sheets.json
```

**Example with real values:**

```bash
PORT=4000
SHEET_ID=1abc123def456ghi789jkl012mno345pqr678stu
GOOGLE_CREDENTIALS_FILE=/Users/jugadboparai/.credentials/surmedania-sheets.json
```

### Step 9: Test the Integration

1. Restart your dev servers:
   ```bash
   cd /Users/jugadboparai/Documents/Surmedania
   npm run dev
   ```

2. Open your app: http://localhost:5175
3. Go to Registration page
4. Fill out the form and submit
5. Check your Google Sheet - the data should appear automatically!

## Troubleshooting

### Error: "Google Sheets append failed"

**Check these:**
- Is `SHEET_ID` correct?
- Did you share the sheet with the service account email?
- Does the service account have "Editor" permissions?
- Is the JSON key file path correct?

**Test your setup:**
```bash
cd server
node -e "console.log(require('dotenv').config()); console.log(process.env.SHEET_ID)"
```

### Error: "Invalid credentials"

- Verify the JSON key file path is absolute (starts with `/`)
- Check file permissions: `ls -l ~/.credentials/surmedania-sheets.json`
- Make sure the file contains valid JSON

### Error: "ENOENT: no such file or directory"

- The path to your JSON key file is wrong
- Use an absolute path, not relative
- Check for typos in the path

### Data appears in CSV but not Google Sheets

- Backend falls back to CSV when Sheets fails
- Check the server logs for error messages
- Verify all environment variables are set correctly

## Security Notes

⚠️ **Important Security Practices:**

1. **Never commit credentials to Git:**
   - `.env` is already in `.gitignore`
   - Never share your service account JSON key

2. **Keep the key file secure:**
   - Store it outside your project directory
   - Set proper file permissions (chmod 600)

3. **Limit service account permissions:**
   - Only share specific sheets, not your entire Drive
   - Use "Editor" not "Owner" permissions

4. **Rotate keys regularly:**
   - Every 90 days, create a new key
   - Delete old keys from Google Cloud Console

## Success!

Once configured, registrations will automatically save to both:
- ✅ Google Sheets (primary)
- ✅ Local CSV file (backup)

You can now manage registrations directly in Google Sheets with all the spreadsheet features available!

## Next Steps

- Set up Google Sheets for feedback (similar process)
- Configure email notifications
- Set up Vipps payment integration
