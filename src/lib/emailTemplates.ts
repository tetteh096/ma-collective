function esc(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function moneyGHS(amount: number): string {
  return `GH₵${amount.toFixed(2)}`;
}

function layout(params: {
  title: string;
  preheader?: string;
  brand?: string;
  bodyHtml: string;
  footerHtml?: string;
}) {
  const brand = params.brand ?? 'MA Collective';
  const preheader = params.preheader ?? '';
  const year = new Date().getFullYear();

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(params.title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f6f7fb;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#111827;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      ${esc(preheader)}
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7fb;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;">
            <tr>
              <td style="padding:0 18px 14px 18px;">
                <div style="font-weight:900;letter-spacing:.16em;text-transform:uppercase;font-size:18px;color:#111827;">${esc(brand)}</div>
              </td>
            </tr>

            <tr>
              <td style="padding:0 18px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;box-shadow:0 8px 28px rgba(17,24,39,.08);overflow:hidden;">
                  <tr>
                    <td style="padding:24px 22px;border-bottom:1px solid #eef2f7;">
                      <div style="font-size:18px;font-weight:800;color:#111827;">${esc(params.title)}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:22px;">
                      ${params.bodyHtml}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:14px 18px 0 18px;">
                <div style="font-size:12px;color:#6b7280;line-height:1.6;">
                  ${params.footerHtml ?? `© ${year} ${esc(brand)}. Made with care in Accra, Ghana.`}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function renderOrderCustomerEmail(args: {
  customerName?: string | null;
  orderId: string;
  totalAmount: number;
  paymentMethod?: string | null;
  notes?: string | null;
  items: Array<{ productName: string; quantity: number; subtotal: number }>;
}) {
  const greeting = args.customerName ? `Hi ${esc(args.customerName)},` : 'Hi,';

  const rows = args.items.map((i) => {
    return `<tr>
      <td style="padding:10px 0;border-bottom:1px solid #eef2f7;">
        <div style="font-weight:700;color:#111827;">${esc(i.productName)}</div>
        <div style="font-size:12px;color:#6b7280;">Qty: ${i.quantity}</div>
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #eef2f7;text-align:right;font-weight:700;color:#111827;">
        ${moneyGHS(i.subtotal)}
      </td>
    </tr>`;
  }).join('');

  const body = `
    <p style="margin:0 0 12px 0;line-height:1.7;color:#111827;">${greeting}</p>
    <p style="margin:0 0 16px 0;line-height:1.7;color:#111827;">
      Thanks for your order. We’ve received it and we’ll contact you shortly to confirm delivery.
    </p>

    <div style="background:#fff7ed;border:1px solid #fed7aa;color:#9a3412;border-radius:12px;padding:12px 14px;margin:0 0 16px 0;">
      <div style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;font-weight:800;">Order ID</div>
      <div style="font-size:16px;font-weight:900;">${esc(args.orderId)}</div>
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${rows}
      <tr>
        <td style="padding:12px 0 0 0;color:#111827;font-weight:800;">Total</td>
        <td style="padding:12px 0 0 0;text-align:right;color:#e85d04;font-weight:900;font-size:18px;">
          ${moneyGHS(args.totalAmount)}
        </td>
      </tr>
    </table>

    <div style="margin-top:16px;padding:14px;border:1px solid #eef2f7;border-radius:12px;background:#f9fafb;">
      <div style="font-size:12px;color:#6b7280;font-weight:800;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;">Details</div>
      <div style="font-size:14px;color:#111827;line-height:1.7;">
        <div><strong>Payment:</strong> ${esc(args.paymentMethod ?? 'N/A')}</div>
        ${args.notes ? `<div style="margin-top:6px;"><strong>Delivery notes:</strong> ${esc(args.notes)}</div>` : ''}
      </div>
    </div>

    <p style="margin:16px 0 0 0;font-size:13px;color:#6b7280;line-height:1.7;">
      If you have any questions, reply to this email and we’ll help.
    </p>
  `;

  return layout({
    title: 'Order received',
    preheader: `Order ${args.orderId} received. Total ${moneyGHS(args.totalAmount)}.`,
    bodyHtml: body,
  });
}

export function renderOrderAdminEmail(args: {
  orderId: string;
  totalAmount: number;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  paymentMethod?: string | null;
  notes?: string | null;
  items: Array<{ productName: string; quantity: number; subtotal: number }>;
}) {
  const rows = args.items.map((i) => {
    return `<tr>
      <td style="padding:10px 0;border-bottom:1px solid #eef2f7;">
        <div style="font-weight:700;color:#111827;">${esc(i.productName)}</div>
        <div style="font-size:12px;color:#6b7280;">Qty: ${i.quantity}</div>
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #eef2f7;text-align:right;font-weight:800;color:#111827;">
        ${moneyGHS(i.subtotal)}
      </td>
    </tr>`;
  }).join('');

  const body = `
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin:0 0 14px 0;">
      <div style="flex:1;min-width:220px;background:#f0f9ff;border:1px solid #bae6fd;color:#075985;border-radius:12px;padding:12px 14px;">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;font-weight:900;">Order ID</div>
        <div style="font-size:16px;font-weight:900;">${esc(args.orderId)}</div>
      </div>
      <div style="flex:1;min-width:220px;background:#fff7ed;border:1px solid #fed7aa;color:#9a3412;border-radius:12px;padding:12px 14px;">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;font-weight:900;">Total</div>
        <div style="font-size:18px;font-weight:900;color:#e85d04;">${moneyGHS(args.totalAmount)}</div>
      </div>
    </div>

    <div style="padding:14px;border:1px solid #eef2f7;border-radius:12px;background:#ffffff;">
      <div style="font-size:12px;color:#6b7280;font-weight:900;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;">Customer</div>
      <div style="font-size:14px;color:#111827;line-height:1.7;">
        <div><strong>Name:</strong> ${esc(args.customerName ?? 'N/A')}</div>
        <div><strong>Email:</strong> ${esc(args.customerEmail ?? 'N/A')}</div>
        <div><strong>Phone:</strong> ${esc(args.customerPhone ?? 'N/A')}</div>
        <div><strong>Payment:</strong> ${esc(args.paymentMethod ?? 'N/A')}</div>
        ${args.notes ? `<div style="margin-top:6px;"><strong>Notes:</strong> ${esc(args.notes)}</div>` : ''}
      </div>
    </div>

    <div style="margin-top:14px;">
      <div style="font-size:12px;color:#6b7280;font-weight:900;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;">Items</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        ${rows}
        <tr>
          <td style="padding:12px 0 0 0;color:#111827;font-weight:900;">Total</td>
          <td style="padding:12px 0 0 0;text-align:right;color:#e85d04;font-weight:900;font-size:18px;">${moneyGHS(args.totalAmount)}</td>
        </tr>
      </table>
    </div>
  `;

  return layout({
    title: 'New order received',
    preheader: `New order ${args.orderId}. Total ${moneyGHS(args.totalAmount)}.`,
    bodyHtml: body,
  });
}

export function renderContactEmail(args: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message?: string;
}) {
  const body = `
    <p style="margin:0 0 14px 0;line-height:1.7;color:#111827;">
      New contact message from <strong>${esc(`${args.firstName} ${args.lastName}`)}</strong>.
    </p>
    <div style="padding:14px;border:1px solid #eef2f7;border-radius:12px;background:#ffffff;">
      <div style="font-size:14px;line-height:1.8;color:#111827;">
        <div><strong>Name:</strong> ${esc(`${args.firstName} ${args.lastName}`)}</div>
        <div><strong>Email:</strong> ${esc(args.email)}</div>
        <div><strong>Phone:</strong> ${esc(args.phone ?? 'N/A')}</div>
      </div>
      <div style="margin-top:12px;padding:12px;border-radius:10px;background:#f9fafb;border:1px solid #eef2f7;">
        <div style="font-size:12px;color:#6b7280;font-weight:900;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;">Message</div>
        <div style="white-space:pre-wrap;font-size:14px;line-height:1.7;color:#111827;">${esc(args.message ?? '')}</div>
      </div>
    </div>
  `;

  return layout({
    title: 'New Contact Us message',
    preheader: `Message from ${args.firstName} ${args.lastName}`,
    bodyHtml: body,
  });
}

