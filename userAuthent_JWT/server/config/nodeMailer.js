import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465, 
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

/**
 * Function to send an email
 * @param {string} recipientEmail - The recipient's email address
 */
const sendMail = async (recipientEmail) => {
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: recipientEmail, // Now using the passed email parameter
        subject: 'Welcome to our app',
        text: `You registered successfully using your email: ${recipientEmail}`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export { transporter, sendMail };
