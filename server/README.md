# Webhook server for Surmedania registrations

This small Express app accepts POST /webhook and will append registration data to a Google Sheet (if configured) or write to `registrations.csv` locally as a fallback.

Setup
1. Install dependencies

```bash
cd server
npm install
```

2. Configure Google Sheets (optional, recommended)
- Create a Google Cloud service account with the Sheets API enabled.
- Grant the service account access to the target spreadsheet (share the sheet with the service account email).
- Create a JSON key and either set `GOOGLE_CLIENT_EMAIL` and `GOOGLE_PRIVATE_KEY` in your environment or paste them into a `.env` file.

Example `.env`:

```
SHEET_ID=your_google_sheet_id_here
GOOGLE_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
PORT=4000
```

# Webhook server for Surmedania registrations

This small Express app accepts POST /webhook and will append registration data to a Google Sheet (if configured) or write to `registrations.csv` locally as a fallback.

Quick setup
1. Install dependencies

```bash
cd server
npm install
```

2. Configure Google Sheets (optional, recommended)

Overview (recommended approach)
- In the Google Cloud Console create a service account and enable the Google Sheets API for your project.
- Create a JSON key for the service account and download it to the server machine (keep it private).
- Share the target Google Sheet with the service account email (the JSON contains an email like `xxxx@project.iam.gserviceaccount.com`).
- Put the spreadsheet ID in `SHEET_ID` and set `GOOGLE_CREDENTIALS_FILE` to the absolute path of the downloaded JSON key file.

How to get the spreadsheet ID
- Open the sheet in your browser. The ID is the long value in the URL: `https://docs.google.com/spreadsheets/d/<THIS_IS_THE_ID>/...`

Environment options (two supported ways)

- Preferred (more secure): set `GOOGLE_CREDENTIALS_FILE` to the path of the downloaded JSON key file.
	Example `.env`:

	```bash
	SHEET_ID=1aBcDeFGhiJklMnoPqRsTuvWxYz1234567890
	GOOGLE_CREDENTIALS_FILE=/absolute/path/to/service-account-key.json
	PORT=4000
	```

- Alternative (direct env vars): set `GOOGLE_CLIENT_EMAIL` and `GOOGLE_PRIVATE_KEY` (private key must preserve newlines; use `\\n` escapes).

	```bash
	SHEET_ID=1aBcDeFGhiJklMnoPqRsTuvWxYz1234567890
	GOOGLE_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
	GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
	PORT=4000
	```

3. Start the server

```bash
npm start
```

Testing the webhook locally

Once the server is running (default port 4000) you can POST a sample registration with curl:

```bash
curl -X POST http://localhost:4000/webhook \
	-H "Content-Type: application/json" \
	-d '{"name":"Test User","email":"test@example.com","phone":"+4712345678","type":"active","day":"Thursday"}'
```

Expected responses:
- If Google Sheets is configured correctly the endpoint will respond with `{"ok":true,"note":"saved-to-sheets"}`.
- If Google Sheets is not configured or fails, the server will write to `server/registrations.csv` and respond with `{"ok":true,"note":"saved-to-csv"}`.

Troubleshooting
- "Google credentials not configured" — ensure `GOOGLE_CREDENTIALS_FILE` or `GOOGLE_CLIENT_EMAIL`/`GOOGLE_PRIVATE_KEY` are set. Use the JSON file approach when possible.
- Permission / 403 error when appending — verify you shared the spreadsheet with the service account email.
- Private key linebreak issues — if you use `GOOGLE_PRIVATE_KEY` directly, newlines must be escaped ("\\n"). The JSON file avoids this problem.

Security notes
- Never commit the JSON key file or the raw private key to git. Use a secrets manager or environment variables in production.
- Consider adding a shared secret or token check to `/webhook` before exposing it publicly.

If you want, I can help you generate the `.env` content (without committing the secret) and run a test POST to verify the sheet receives rows.
