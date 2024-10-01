import { createTransport } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import Mail from 'nodemailer/lib/mailer';
import { getConfig } from './config';
import { EMAIL_ID, EMAIL_PWD } from './secrets';
import rollbar from './rollbar';

let _transporter: Mail = null;
export async function sendEmail(
  toEmailList: string[],
  subject: string,
  body: string,
  isHTML: boolean = false
) {
  const mailOptions: MailOptions = {
    from: EMAIL_ID,
    to: toEmailList,
    subject,
  };
  if (isHTML) {
    mailOptions.html = body;
  } else {
    mailOptions.text = body;
  }
  try {
    await _transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    rollbar.error(`Email not sent --- sender->${EMAIL_ID} receiver ->${toEmailList} ${error.message}`)
    console.log('There is error sending email', error);
  }
}

export async function getConfiguredEmailIds() {
  return getConfig('NEW_USER_NOTIFY_EMAIL_LIST', true);
}

export function createEmailTransport() {
  _transporter = createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_ID,
      pass: EMAIL_PWD,
    },
  });
}
