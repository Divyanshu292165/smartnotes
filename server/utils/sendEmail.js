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
    }
    // Removed strict 10s timeouts to prevent ETIMEDOUT on slower cloud networks (e.g. Render Free Tier)
  });

  const mailOptions = {
    from: `"SmartNotes" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html
  };

  console.log('📧 Attempting to send email to:', options.email);
  console.log('📧 Using EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
  console.log('📧 Using EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET (hidden)' : 'NOT SET');

  await transporter.sendMail(mailOptions);
  console.log('✅ Email sent successfully to:', options.email);
};

module.exports = sendEmail;
