import nodemailer from 'nodemailer';

type SendEmailArgs = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
};

function getEnv(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : undefined;
}

export function isEmailConfigured(): boolean {
  return Boolean(getEnv('SMTP_HOST') && getEnv('SMTP_PORT') && getEnv('SMTP_USER') && getEnv('SMTP_PASS'));
}

function getTransport() {
  const host = getEnv('SMTP_HOST');
  const port = Number(getEnv('SMTP_PORT') ?? '');
  const secure = (getEnv('SMTP_SECURE') ?? '').toLowerCase() === 'true';
  const user = getEnv('SMTP_USER');
  const pass = getEnv('SMTP_PASS');

  if (!host || !port || !user || !pass) {
    throw new Error('SMTP is not configured (SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS)');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export async function sendEmail(args: SendEmailArgs) {
  const from = getEnv('MAIL_FROM') ?? 'MA Collective <noreply@aficlothing.com>';
  const transport = getTransport();

  return transport.sendMail({
    from,
    to: args.to,
    subject: args.subject,
    text: args.text,
    html: args.html,
    replyTo: args.replyTo,
  });
}

