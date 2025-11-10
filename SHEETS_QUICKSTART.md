# Google Sheets Quick Setup

## What You Need

1. **Google Sheet ID** - Get it from your spreadsheet URL
2. **Service Account Key** - Download from Google Cloud Console
3. **Share Sheet** - Give service account Editor access

---

## 🚀 Quick Start (5 minutes)

### 1. Create Service Account

```
1. Go to: https://console.cloud.google.com
2. Create project: "Surmedania Dance School"
3. Enable API: Search "Google Sheets API" → Enable
4. Create Credentials → Service Account
   Name: surmedania-webhook
5. Download JSON key
```

### 2. Setup Key File

```bash
# Move key to secure location
mkdir -p ~/.credentials
mv ~/Downloads/surmedania-*.json ~/.credentials/surmedania-sheets.json
chmod 600 ~/.credentials/surmedania-sheets.json
```

### 3. Create Google Sheet

```
1. New Google Sheet
2. Name: "Surmedania Registrations"
3. Add header row (copy exactly):

Timestamp | Full Name | Email | Phone | Date of Birth | Member Type | Class Selection | Skill Level | Comments / Notes | Payment Amount | Payment Status
```

### 4. Share Sheet

```
1. Open JSON key file
2. Copy the "client_email" value
3. In your sheet: Share button
4. Paste email → Editor access → Share
```

### 5. Configure .env

Edit `server/.env`:

```bash
SHEET_ID=paste_your_sheet_id_here
GOOGLE_CREDENTIALS_FILE=/Users/jugadboparai/.credentials/surmedania-sheets.json
PORT=4000
```

### 6. Test Connection

```bash
cd server
node test-sheets-connection.js
```

If all ✅ then you're done!

---

## 📍 Where to Find Things

**Sheet ID:**
- Open your Google Sheet
- Look at URL: `https://docs.google.com/spreadsheets/d/[THIS_IS_THE_ID]/edit`
- Copy the long ID between `/d/` and `/edit`

**Service Account Email:**
- Open your JSON key file
- Find: `"client_email": "xxx@xxx.iam.gserviceaccount.com"`

**JSON Key File:**
- Downloaded from Google Cloud Console
- Should be in `~/.credentials/` folder
- Never commit to Git!

---

## ✅ Test Checklist

Before running the test script:

- [ ] Created Google Cloud project
- [ ] Enabled Google Sheets API
- [ ] Created service account
- [ ] Downloaded JSON key
- [ ] Moved key to `~/.credentials/`
- [ ] Created Google Sheet with header row
- [ ] Shared sheet with service account email
- [ ] Added SHEET_ID to .env
- [ ] Added GOOGLE_CREDENTIALS_FILE to .env

Run test:
```bash
cd server
node test-sheets-connection.js
```

---

## 🆘 Common Errors

**"Entity not found"**
→ Sheet ID is wrong OR sheet not shared with service account

**"Invalid credentials"**
→ JSON key file path is wrong or file is corrupted

**"Permission denied"**
→ Service account doesn't have Editor access to the sheet

**"API not enabled"**
→ Enable Google Sheets API in Cloud Console

---

## 📞 Need Help?

1. Run the test script first: `node test-sheets-connection.js`
2. Check the detailed guide: `GOOGLE_SHEETS_SETUP.md`
3. Verify each step in the checklist above
