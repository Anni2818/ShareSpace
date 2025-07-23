const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (to, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

  const subject = 'Verify Your Email - ShareSpace';
  const html = `
    <p>Hello,</p>
    <p>Thank you for registering on <strong>ShareSpace</strong>. Please verify your email by clicking the button below:</p>
    <p><a href="${verificationUrl}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none;">Verify Email</a></p>
    <p>If the button doesn't work, click or copy the link below:</p>
    <p><a href="${verificationUrl}">${verificationUrl}</a></p>
    <p>Regards,<br/>ShareSpace Team</p>
  `;

  await transporter.sendMail({
    from: `"ShareSpace" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendVerificationEmail;
