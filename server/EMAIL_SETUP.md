# Email Setup Guide for Surmedania Dance School

This guide will help you set up automated thank you emails for supported members.

## Overview

When a supported member completes their registration and payment, they will automatically receive a beautifully formatted thank you email with:
- Personalized greeting
- Confirmation of their payment amount
- Information about what their support enables
- Details about supported member benefits
- Contact information

## Setup Options

### Option 1: Gmail (Recommended for Getting Started)

1. **Use the school's Gmail account**: `surmedania@gmail.com`

2. **Enable 2-Factor Authentication**:
   - Go to https://myaccount.google.com/security
   - Turn on 2-Step Verification if not already enabled

3. **Create an App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Surmedania Webhook Server"
   - Click "Generate"
   - Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

4. **Update `.env` file**:
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=surmedania@gmail.com
   EMAIL_PASSWORD=abcdefghijklmnop
   ```
   (Replace `abcdefghijklmnop` with your actual app password, no spaces)

### Option 2: Custom SMTP Provider

If you want to use a different email service (SendGrid, Mailgun, etc.):

1. **Get SMTP credentials from your provider**

2. **Update `.env` file**:
   ```env
   # Comment out or remove EMAIL_SERVICE=gmail
   SMTP_HOST=smtp.your-provider.com
   SMTP_PORT=587
   EMAIL_USER=your-email@example.com
   EMAIL_PASSWORD=your-password-here
   ```

## Testing the Email

1. **Start the webhook server**:
   ```bash
   cd server
   node index.js
   ```

2. **Test with a supported member registration**:
   - Go to your website
   - Click "Supported Member" tab
   - Fill out the registration form
   - Complete payment
   - Check the email inbox

3. **Check server logs**:
   - You should see: "Sending thank you email to supported member: [email]"
   - If successful: "Thank you email sent: [messageId]"
   - If failed: "Error sending email: [error message]"

## Customizing the Email Template

The email template is in `server/emailService.js`. You can customize:

- **Subject line**: Line 33
- **HTML content**: Lines 35-110
- **Plain text version**: Lines 112-141
- **Colors and styling**: The CSS in the `<style>` section

### Current Email Features:
- Responsive design
- Gold/offwhite branding matching website
- Professional HTML and plain text versions
- Personalized with recipient's name and payment amount
- Lists all supported member benefits

## Important Notes

1. **Security**: Never commit the actual `.env` file with real passwords to Git
2. **Email limits**: Gmail has a sending limit of ~500 emails/day
3. **Non-blocking**: Email sending won't prevent registration from completing if it fails
4. **Only for supported members**: Active members don't receive this email (they get Spond invite instead)

## Troubleshooting

### "Invalid login" error
- Make sure you're using an App Password, not your regular Gmail password
- Check that 2FA is enabled on the Gmail account

### Email not sending
- Check server logs for error messages
- Verify `.env` file has correct credentials
- Test SMTP connection with a simple script

### Email goes to spam
- Add SPF/DKIM records to your domain (if using custom domain)
- Ask recipients to add surmedania@gmail.com to contacts
- Use a professional email service in production (SendGrid, AWS SES, etc.)

## Production Recommendations

For production use, consider:
1. **Professional email service** (SendGrid, Mailgun, AWS SES) for better deliverability
2. **Email templates service** for easier management
3. **Email analytics** to track open rates
4. **Unsubscribe functionality** for newsletters (if sending regular updates)

## Support

If you need help with email setup, contact the developer:
**Jugad Boparai** - Developer of Surmedania Dance School website
