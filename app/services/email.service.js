
import transporter from '../config/emailTransporter.js';

const from = process.env.SMTP_USER
export async function sendEmail ( { to, subject, text }) {
     const result = await transporter.sendMail({
        from,
        to,
        subject,
        text,
    });
     return result
}

