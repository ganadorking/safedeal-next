import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.NODE_ENV === 'production'
  ? 'SafeDeal <noreply@safedeal.com>'
  : 'SafeDeal <onboarding@resend.dev>';

// ── Shared email wrapper ──────────────────────────────────────────────
function baseTemplate(title: string, body: string): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FFFFFF;font-family:Inter,system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFFFFF;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#4A7CF7 0%,#4A7CF7 100%);padding:32px 40px;text-align:center;">
            <span style="font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">Safe</span><span style="font-size:28px;font-weight:800;color:rgba(255,255,255,0.9);letter-spacing:-0.5px;">Deal</span>
            <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.8);">${title}</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            ${body}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:24px 40px;background:#F8FAFC;border-top:1px solid #E2E8F0;text-align:center;">
            <p style="margin:0 0 8px;font-size:12px;color:#94A3B8;">SafeDeal &mdash; La plataforma mas segura para comprar y vender</p>
            <p style="margin:0;font-size:11px;color:#94A3B8;">Este correo fue enviado automaticamente. No respondas a este mensaje.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function button(text: string, href: string): string {
  return `<a href="${href}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#4A7CF7 0%,#4A7CF7 100%);color:#ffffff;text-decoration:none;border-radius:12px;font-weight:600;font-size:14px;">${text}</a>`;
}

// ── sendWelcomeEmail ──────────────────────────────────────────────────
export async function sendWelcomeEmail(to: string, username: string) {
  const body = `
    <h1 style="margin:0 0 16px;font-size:22px;color:#0F172A;">Bienvenido a SafeDeal, ${username}!</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#64748B;line-height:1.6;">
      Tu cuenta ha sido creada exitosamente. Ahora puedes comprar y vender productos digitales de forma segura.
    </p>
    <div style="background:#F8FAFC;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#0F172A;">Con SafeDeal puedes:</p>
      <ul style="margin:0;padding-left:20px;color:#64748B;font-size:13px;line-height:1.8;">
        <li>Comprar productos digitales con proteccion al comprador</li>
        <li>Vender tus productos y recibir pagos seguros</li>
        <li>Resolver disputas con nuestro sistema de mediacion</li>
      </ul>
    </div>
    <div style="text-align:center;">
      ${button('Explorar productos', `${process.env.NEXT_PUBLIC_APP_URL || 'https://safedeal.com'}/search`)}
    </div>
  `;

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Bienvenido a SafeDeal! 🎮',
    html: baseTemplate('Bienvenido a la comunidad', body),
  });
}

// ── sendPurchaseConfirmation ──────────────────────────────────────────
export async function sendPurchaseConfirmation(
  to: string,
  orderNumber: string,
  items: { title: string; quantity: number; price: number }[],
  total: number
) {
  const itemRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #E2E8F0;font-size:14px;color:#0F172A;">${item.title}</td>
        <td style="padding:10px 0;border-bottom:1px solid #E2E8F0;font-size:14px;color:#64748B;text-align:center;">x${item.quantity}</td>
        <td style="padding:10px 0;border-bottom:1px solid #E2E8F0;font-size:14px;color:#4A7CF7;text-align:right;font-weight:600;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    )
    .join('');

  const body = `
    <h1 style="margin:0 0 8px;font-size:22px;color:#0F172A;">Compra confirmada!</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#64748B;">Tu pago ha sido procesado exitosamente.</p>
    <div style="background:#F8FAFC;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;font-size:13px;color:#94A3B8;">Numero de orden</p>
      <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:#4A7CF7;">${orderNumber}</p>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <tr>
        <th style="text-align:left;padding:8px 0;border-bottom:2px solid #E2E8F0;font-size:12px;color:#94A3B8;text-transform:uppercase;">Producto</th>
        <th style="text-align:center;padding:8px 0;border-bottom:2px solid #E2E8F0;font-size:12px;color:#94A3B8;text-transform:uppercase;">Cant</th>
        <th style="text-align:right;padding:8px 0;border-bottom:2px solid #E2E8F0;font-size:12px;color:#94A3B8;text-transform:uppercase;">Precio</th>
      </tr>
      ${itemRows}
    </table>
    <div style="text-align:right;margin-bottom:24px;">
      <span style="font-size:13px;color:#64748B;">Total: </span>
      <span style="font-size:20px;font-weight:700;color:#4A7CF7;">$${total.toFixed(2)}</span>
    </div>
    <div style="text-align:center;">
      ${button('Ver mi pedido', `${process.env.NEXT_PUBLIC_APP_URL || 'https://safedeal.com'}/purchases`)}
    </div>
  `;

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Orden ${orderNumber} confirmada`,
    html: baseTemplate('Compra confirmada', body),
  });
}

// ── sendSaleNotification ─────────────────────────────────────────────
export async function sendSaleNotification(
  to: string,
  sellerName: string,
  productTitle: string,
  amount: number
) {
  const body = `
    <h1 style="margin:0 0 8px;font-size:22px;color:#0F172A;">Hiciste una venta!</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#64748B;">Felicidades ${sellerName}, alguien compro tu producto.</p>
    <div style="background:#F8FAFC;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 4px;font-size:13px;color:#94A3B8;">Producto vendido</p>
      <p style="margin:0 0 16px;font-size:16px;font-weight:600;color:#0F172A;">${productTitle}</p>
      <p style="margin:0 0 4px;font-size:13px;color:#94A3B8;">Monto recibido</p>
      <p style="margin:0;font-size:24px;font-weight:700;color:#10b981;">$${amount.toFixed(2)}</p>
    </div>
    <div style="text-align:center;">
      ${button('Ver mis ventas', `${process.env.NEXT_PUBLIC_APP_URL || 'https://safedeal.com'}/sales`)}
    </div>
  `;

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Vendiste "${productTitle}" por $${amount.toFixed(2)}`,
    html: baseTemplate('Nueva venta', body),
  });
}

// ── sendOrderDelivered ───────────────────────────────────────────────
export async function sendOrderDelivered(to: string, orderNumber: string) {
  const body = `
    <h1 style="margin:0 0 8px;font-size:22px;color:#0F172A;">Tu pedido fue entregado!</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#64748B;">La orden <strong>${orderNumber}</strong> ha sido entregada exitosamente.</p>
    <div style="background:#f0fdf4;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center;">
      <div style="font-size:40px;margin-bottom:8px;">&#10003;</div>
      <p style="margin:0;font-size:14px;color:#10b981;font-weight:600;">Entregado correctamente</p>
    </div>
    <p style="margin:0 0 24px;font-size:13px;color:#64748B;line-height:1.6;">
      Si tienes algun problema con tu compra, puedes abrir una disputa dentro de las proximas 48 horas.
    </p>
    <div style="text-align:center;">
      ${button('Ver mi pedido', `${process.env.NEXT_PUBLIC_APP_URL || 'https://safedeal.com'}/purchases`)}
    </div>
  `;

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Orden ${orderNumber} entregada`,
    html: baseTemplate('Pedido entregado', body),
  });
}

// ── sendDisputeOpened ────────────────────────────────────────────────
export async function sendDisputeOpened(
  to: string,
  disputeId: number,
  reason: string
) {
  const body = `
    <h1 style="margin:0 0 8px;font-size:22px;color:#0F172A;">Se abrio una disputa</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#64748B;">Se ha abierto una disputa que requiere tu atencion.</p>
    <div style="background:#fef3c7;border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid #f59e0b;">
      <p style="margin:0 0 4px;font-size:13px;color:#92400e;">Disputa #${disputeId}</p>
      <p style="margin:0;font-size:15px;font-weight:600;color:#92400e;">${reason}</p>
    </div>
    <p style="margin:0 0 24px;font-size:13px;color:#64748B;line-height:1.6;">
      Nuestro equipo revisara el caso. Tienes 72 horas para responder con evidencia.
    </p>
    <div style="text-align:center;">
      ${button('Ver disputa', `${process.env.NEXT_PUBLIC_APP_URL || 'https://safedeal.com'}/disputes`)}
    </div>
  `;

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Disputa #${disputeId} abierta`,
    html: baseTemplate('Disputa abierta', body),
  });
}

// ── sendPasswordReset ────────────────────────────────────────────────
export async function sendPasswordReset(to: string, resetLink: string) {
  const body = `
    <h1 style="margin:0 0 8px;font-size:22px;color:#0F172A;">Restablecer contrasena</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#64748B;line-height:1.6;">
      Recibimos una solicitud para restablecer la contrasena de tu cuenta SafeDeal. Si no hiciste esta solicitud, ignora este correo.
    </p>
    <div style="text-align:center;margin-bottom:24px;">
      ${button('Restablecer contrasena', resetLink)}
    </div>
    <p style="margin:0;font-size:12px;color:#94A3B8;line-height:1.6;">
      Este enlace expira en 1 hora. Si no puedes hacer clic en el boton, copia y pega esta URL en tu navegador:<br/>
      <span style="color:#4A7CF7;word-break:break-all;">${resetLink}</span>
    </p>
  `;

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Restablecer tu contrasena - SafeDeal',
    html: baseTemplate('Restablecer contrasena', body),
  });
}
