import { NextRequest, NextResponse } from 'next/server';
import { isEmailConfigured, sendEmail } from '@/lib/email';
import { renderContactEmail } from '@/lib/emailTemplates';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const firstName = String(body.firstName ?? '').trim();
    const lastName = String(body.lastName ?? '').trim();
    const email = String(body.email ?? '').trim();
    const phone = String(body.phone ?? '').trim();
    const message = String(body.message ?? '').trim();

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: 'First name, last name, and email are required.' }, { status: 400 });
    }

    const to = (process.env.MAIL_CONTACT_TO ?? process.env.MAIL_ADMIN_TO ?? '').trim();
    if (!to) {
      return NextResponse.json({ error: 'Contact email destination is not configured.' }, { status: 500 });
    }

    if (!isEmailConfigured()) {
      return NextResponse.json({ error: 'Email service is not configured yet.' }, { status: 500 });
    }

    const subject = `Contact Us: ${firstName} ${lastName}`;
    const text =
      `New contact message\n\n` +
      `Name: ${firstName} ${lastName}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone || 'N/A'}\n\n` +
      `Message:\n${message}\n`;

    await sendEmail({
      to,
      subject,
      text,
      html: renderContactEmail({ firstName, lastName, email, phone: phone || undefined, message }),
      replyTo: email,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('POST /api/contact', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

