const nodemailer = require('nodemailer')

// Create email transporter
// You can use Gmail, SendGrid, or any SMTP service
const createTransporter = () => {
  // Option 1: Gmail (requires app password)
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // Use App Password, not regular password
      }
    })
  }
  
  // Option 2: Custom SMTP
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })
}

// Send thank you email to supported members
async function sendThankYouEmail(memberData) {
  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: `"Surmedania Dance School" <${process.env.EMAIL_USER}>`,
      to: memberData.email,
      subject: 'Thank You for Your Support! 🙏',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #BFA14A 0%, #D4B566 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #F8F5F0; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .highlight { color: #BFA14A; font-weight: bold; }
            .button { display: inline-block; padding: 12px 30px; background: #BFA14A; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Thank You for Your Support!</h1>
            </div>
            <div class="content">
              <p>Dear ${memberData.name},</p>
              
              <p>We are incredibly grateful for your support of <span class="highlight">Surmedania Dance School</span>!</p>
              
              <p>Your contribution of <strong>${memberData.paymentAmount} NOK</strong> helps us continue our mission to celebrate and share the beauty of Punjabi dance and culture.</p>
              
              <h3 style="color: #BFA14A;">What Your Support Does:</h3>
              <ul>
                <li>Enables us to provide quality dance education</li>
                <li>Helps maintain our dance studio and equipment</li>
                <li>Supports community performances and cultural events</li>
                <li>Allows us to grow and reach more people</li>
              </ul>
              
              <p>As a <span class="highlight">Supported Member</span>, you will receive:</p>
              <ul>
                <li>✅ Regular updates about our activities</li>
                <li>✅ Newsletters with dance and cultural content</li>
                <li>✅ Early announcements about performances and events</li>
                <li>✅ Behind-the-scenes glimpses of our dance community</li>
              </ul>
              
              <p style="margin-top: 30px;">We truly appreciate your belief in our vision and your commitment to supporting the arts.</p>
              
              <p><strong>With heartfelt gratitude,</strong><br>
              The Surmedania Dance School Team</p>
              
              <div style="margin-top: 30px; padding: 20px; background: white; border-left: 4px solid #BFA14A; border-radius: 5px;">
                <strong>Questions or feedback?</strong><br>
                Email us at <a href="mailto:surmedania@gmail.com" style="color: #BFA14A;">surmedania@gmail.com</a>
              </div>
            </div>
            <div class="footer">
              <p>Surmedania Dance School | Ravinen, Rælingen</p>
              <p>© 2025 Surmedania Dance School. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Dear ${memberData.name},

Thank you for your support!

We are incredibly grateful for your support of Surmedania Dance School!

Your contribution of ${memberData.paymentAmount} NOK helps us continue our mission to celebrate and share the beauty of Punjabi dance and culture.

What Your Support Does:
- Enables us to provide quality dance education
- Helps maintain our dance studio and equipment
- Supports community performances and cultural events
- Allows us to grow and reach more people

As a Supported Member, you will receive:
- Regular updates about our activities
- Newsletters with dance and cultural content
- Early announcements about performances and events
- Behind-the-scenes glimpses of our dance community

We truly appreciate your belief in our vision and your commitment to supporting the arts.

With heartfelt gratitude,
The Surmedania Dance School Team

---
Questions or feedback?
Email us at surmedania@gmail.com

Surmedania Dance School | Ravinen, Rælingen
© 2025 Surmedania Dance School. All rights reserved.
      `
    }
    
    const info = await transporter.sendMail(mailOptions)
    console.log('Thank you email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: error.message }
  }
}

module.exports = { sendThankYouEmail }
