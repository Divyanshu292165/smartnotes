// server/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter using Gmail SMTP (or any SMTP provider)
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    family: 4, // Force IPv4 to avoid ENETUNREACH on IPv6 connections
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // Use an App Password, NOT your real Gmail password
    },
    connectionTimeout: 10000,  // 10 seconds to connect
    greetingTimeout: 10000,    // 10 seconds for greeting
    socketTimeout: 10000       // 10 seconds for socket
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
