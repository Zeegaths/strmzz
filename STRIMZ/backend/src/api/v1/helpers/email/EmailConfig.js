const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,      
    pass: process.env.EMAIL_APP_PASSWORD  
});

exports.sendMail = async (receiver, text, html, subject) => {
  try {
    const info = await transporter.sendMail({
      from: `Strimz <${process.env.EMAIL_USER}>`,
      to: receiver,
      subject: subject ?? 'Email Verification',
      html: html || undefined,
      text: text || undefined,
    });
    console.log('[Email] Sent to', receiver, 'id:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('[Email] Send failed:', error);
    return { success: false };
  }
};