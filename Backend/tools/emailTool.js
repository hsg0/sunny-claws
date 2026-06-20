import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const emailTool = async (emailInfo) => {
  try {
    const to = emailInfo?.to;
    const subject = emailInfo?.subject;
    const body = emailInfo?.body;

    if (!to || !subject || !body) {
      return 'Email tool needs to, subject, and body.';
    }

    const gmailEmail = process.env.GMAIL_EMAIL?.trim();
    const gmailPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, '');

    console.log('EMAIL TOOL STARTED');
    console.log('GMAIL_EMAIL value:', gmailEmail);
    console.log('GMAIL_APP_PASSWORD length:', gmailPassword?.length);
    console.log('Sending email to:', to);
    console.log('Subject:', subject);

    if (!gmailEmail || !gmailPassword) {
      return 'Gmail email or app password is missing in .env.';
    }

    const emailTransporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: gmailEmail,
        pass: gmailPassword,
      },
    });

    const result = await emailTransporter.sendMail({
      from: gmailEmail,
      to,
      subject,
      text: body,
    });

    console.log('EMAIL SENT:', result.messageId);

    return `Email sent successfully to ${to}. Message id: ${result.messageId}`;
  } catch (error) {
    console.log('EMAIL TOOL ERROR');
    console.log(error);

    return `Email tool could not send the email. Error code: ${error.code || 'unknown'}`;
  }
};