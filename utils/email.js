const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) create a transporter
  const transporter = nodemailer.createTransport({
    // service: 'Gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Mukesh Bitlani <hello@gmail.com>',
    to: options.email,
    subject: options.subject || 'no subject',
    text: options.message || 'no message'
    // html
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
