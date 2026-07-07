import nodemailer from 'nodemailer';

let cached: nodemailer.Transporter | null = null;

export function getTransporter(): nodemailer.Transporter {
  if (cached) return cached;

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    throw new Error(
      'Email sending is not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD in .env, then restart `npm run dev`.'
    );
  }

  cached = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
  return cached;
}

export async function sendInviteEmail(params: {
  to: string;
  name: string;
  tempPassword: string;
  loginUrl: string;
}): Promise<void> {
  const { to, name, tempPassword, loginUrl } = params;
  const firstName = (name.split(/\s+/)[0] || name).trim();

  const info = await getTransporter().sendMail({
    from: `"Products Board" <${process.env.GMAIL_USER}>`,
    to,
    replyTo: process.env.GMAIL_USER,
    subject: 'You are invited to Products Board',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9fafb; border-radius: 12px;">
        <div style="background: white; border-radius: 12px; padding: 32px; border: 1px solid #e5e7eb;">
          <h1 style="color: #1d4ed8; font-size: 22px; margin-bottom: 4px;">Welcome to Products Board</h1>
          <p style="color: #6b7280; font-size: 14px; margin-bottom: 24px;">
            An admin invited you to the team.
          </p>

          <p style="color: #374151; font-size: 15px;">Hi <strong>${firstName}</strong>,</p>
          <p style="color: #374151; font-size: 14px; line-height: 1.6;">
            Sign in with the credentials below to access your tasks, sprints, and reviews.
          </p>

          <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 24px 0; border-left: 4px solid #1d4ed8;">
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #6b7280; font-weight: 600; text-transform: uppercase;">Your Login</p>
            <p style="margin: 0 0 6px 0; font-size: 14px; color: #374151;"><strong>Email:</strong> ${to}</p>
            <p style="margin: 0; font-size: 14px; color: #374151;">
              <strong>Temporary password:</strong>
              <span style="font-family: monospace; background: #e5e7eb; padding: 2px 8px; border-radius: 4px;">${tempPassword}</span>
            </p>
          </div>

          <p style="color: #ef4444; font-size: 13px; background: #fef2f2; padding: 12px; border-radius: 8px; border: 1px solid #fecaca;">
            Please reset your password immediately after your first login. Use the "Forgot password?" link on the sign-in page.
          </p>

          <a href="${loginUrl}" style="display: inline-block; margin-top: 20px; padding: 12px 28px; background: #1d4ed8; color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">
            Open Products Board →
          </a>

          <p style="margin-top: 32px; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 16px;">
            If you didn't expect this email, ignore it or reply to let us know.
          </p>
        </div>
      </div>
    `,
  });
  console.log('[invite email] sent', {
    to,
    messageId: info.messageId,
    accepted: info.accepted,
    rejected: info.rejected,
    response: info.response,
  });
}
