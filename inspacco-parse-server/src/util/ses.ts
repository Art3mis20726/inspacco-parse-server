import nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import Mail from 'nodemailer/lib/mailer';

import * as AWS from 'aws-sdk';

import { getConfig } from './config';
import rollbar from './rollbar';

let _ses_transporter = null;
export async function sendEmail(
  toEmailList: string[],
  subject: string,
  body: string,
  isHTML: boolean = false,
  attachments: Mail.Attachment[] = []
) {
  const mailOptions: MailOptions = {
    from: process.env.SES_SMTP_FROM,
    to: toEmailList,
    subject,
    attachments: attachments
  };
  if (isHTML) {
    mailOptions.html = body;
  } else {
    mailOptions.text = body;
  }
  try {
    await _ses_transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    rollbar.error(`${subject} Email not sent ${error.message}`)
    console.log('There is error sending email', error);
  }
}

export async function getConfiguredEmailIds() {
  //return getConfig('DAILY_REPORT_USER_NOTIFY_EMAIL_LIST', true);
  return process.env.DAILY_REPORT_USER_NOTIFY_EMAIL_LIST.split(',');
}

export function createSesEmailTransport() {
  _ses_transporter = nodemailer.createTransport({
    SES: new AWS.SES({
      accessKeyId: process.env.SES_ACCESS_KEY,
      secretAccessKey: process.env.SES_SECRET_ACCESS_KEY,
      sslEnabled: true,
      region: process.env.SES_REGION
    }),
  });
}
