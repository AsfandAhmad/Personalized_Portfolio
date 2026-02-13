import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an email notification for contact form submissions
 */
export async function sendContactEmail({ name, email, subject, message }) {
  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO || process.env.EMAIL_USER,
    replyTo: email,
    subject: `Portfolio Contact: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0A; color: #FFFFFF; padding: 30px; border: 1px solid #FF073A; border-radius: 10px;">
        <h2 style="color: #FF073A; border-bottom: 2px solid #FF073A; padding-bottom: 10px;">
          📩 New Contact Message
        </h2>
        <div style="margin: 20px 0;">
          <p><strong style="color: #FF073A;">Name:</strong> ${name}</p>
          <p><strong style="color: #FF073A;">Email:</strong> ${email}</p>
          <p><strong style="color: #FF073A;">Subject:</strong> ${subject}</p>
        </div>
        <div style="background: #111111; padding: 15px; border-radius: 8px; border-left: 3px solid #FF073A;">
          <p style="color: #CCCCCC;">${message.replace(/\n/g, '<br>')}</p>
        </div>
        <p style="font-size: 12px; color: #666; margin-top: 20px;">
          Sent from your portfolio website contact form.
        </p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

/**
 * Send an email notification for chatbot queries
 */
export async function sendChatbotEmail({ sessionId, userMessage, botResponse }) {
  const mailOptions = {
    from: `"Portfolio Chatbot" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO || process.env.EMAIL_USER,
    subject: `Chatbot Query - Session ${sessionId?.slice(0, 8)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0A; color: #FFFFFF; padding: 30px; border: 1px solid #FF073A; border-radius: 10px;">
        <h2 style="color: #FF073A; border-bottom: 2px solid #FF073A; padding-bottom: 10px;">
          🤖 Chatbot Query
        </h2>
        <div style="margin: 20px 0;">
          <p><strong style="color: #FF073A;">Session:</strong> ${sessionId}</p>
        </div>
        <div style="background: #111111; padding: 15px; border-radius: 8px; margin: 10px 0;">
          <p style="color: #FF073A; font-weight: bold;">User:</p>
          <p style="color: #CCCCCC;">${userMessage}</p>
        </div>
        <div style="background: #111111; padding: 15px; border-radius: 8px; margin: 10px 0;">
          <p style="color: #4CAF50; font-weight: bold;">Bot:</p>
          <p style="color: #CCCCCC;">${botResponse}</p>
        </div>
        <p style="font-size: 12px; color: #666; margin-top: 20px;">
          Automated notification from your portfolio chatbot.
        </p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}
