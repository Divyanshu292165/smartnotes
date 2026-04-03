// server/utils/sendEmail.js
const nodemailer = require('nodemailer');
const dns = require('dns');

// Force Node.js DNS resolution to prefer IPv4 over IPv6.
// This strongly prevents the ENETUNREACH errors on ipv6 networks.
dns.setDefaultResultOrder('ipv4first');

const sendEmail = async (options) => {
  // Create a transporter using Gmail SMTP (or any SMTP provider)
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use false for port 587
    requireTLS: true,
    family: 4, // Force IPv4 to avoid ENETUNREACH on IPv6 connections locally
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // Use an App Password, NOT your real Gmail password
    },
    // Adding short timeouts so Render doesn't hang for 2 minutes when it blocks SMTP
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 5000
  });

  const mailOptions = {
    from: `"SmartNotes" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html
  };

  console.log('📧 Attempting to send email to:', options.email);
  console.log('📧 Using EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', options.email);
  } catch (error) {
    console.error('❌ Email sending failed (Likely blocked by Render Free Tier):', error.message);
    console.log('⚠️ As a fallback for testing, here is the email content that was supposed to be sent:');
    console.log('==================== EMAIL CONTENT ====================');
    console.log(options.html);
    console.log('=======================================================');
    // We do not throw the error here so the frontend can still show a success message
    // and the user can click the link from the Render logs to test the password reset flow.
  }
};

module.exports = sendEmail;
