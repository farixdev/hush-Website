import nodemailer from "nodemailer";
import { getSettings, type ContactInquiry } from "./store";

export type SendEmailOptions = {
  to?: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const settings = await getSettings();
    const recipient = options.to || settings.admin_notification_email || settings.smtp_user;

    if (!recipient) {
      console.warn("sendEmail: No recipient or admin notification email specified.");
      return { success: false, error: "No recipient specified and admin notification email not set." };
    }

    if (!settings.smtp_host || !settings.smtp_user) {
      console.log(`[SMTP Mock Mode - No SMTP configured]: To: ${recipient} | Subject: ${options.subject}`);
      return { success: false, error: "SMTP host or user is not configured in Admin Settings." };
    }

    const transporter = nodemailer.createTransport({
      host: settings.smtp_host,
      port: Number(settings.smtp_port) || 587,
      secure: Boolean(settings.smtp_secure),
      auth: {
        user: settings.smtp_user,
        pass: settings.smtp_pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const info = await transporter.sendMail({
      from: settings.smtp_from || settings.smtp_user,
      to: recipient,
      subject: options.subject,
      text: options.text || options.html.replace(/<[^>]+>/g, ""),
      html: options.html,
    });

    return { success: true, messageId: info.messageId };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("sendEmail error:", errorMsg);
    return { success: false, error: errorMsg };
  }
}

export async function sendTestEmail(targetEmail: string): Promise<{ success: boolean; error?: string }> {
  return sendEmail({
    to: targetEmail,
    subject: "Hush · SMTP Connection Verification",
    html: `
      <div style="font-family: sans-serif; background: #000; color: #fff; padding: 24px; border-radius: 12px;">
        <h2 style="color: #fff; margin-top: 0;">Hush · SMTP Connection Verified</h2>
        <p style="color: #ccc; font-size: 14px;">This is a test notification confirming your custom SMTP server is functioning properly for Hush and Edge Brain Software.</p>
        <p style="color: #888; font-size: 12px; margin-top: 20px;">Sent at: ${new Date().toISOString()}</p>
      </div>
    `,
  });
}

export async function notifyAdminNewInquiry(contact: ContactInquiry): Promise<void> {
  const settings = await getSettings();
  const to = settings.admin_notification_email || settings.smtp_user;
  if (!to) return;

  await sendEmail({
    to,
    subject: `[Hush Inquiry] New Project Lead from ${contact.name} (${contact.company || "Individual"})`,
    html: `
      <div style="font-family: sans-serif; background: #0a0a0a; color: #f5f5f5; padding: 24px; border-radius: 12px; border: 1px solid #333;">
        <h2 style="color: #fff; margin-top: 0; border-bottom: 1px solid #333; padding-bottom: 12px;">New Project Inquiry · Hush & Edge Brain Software</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
          <tr><td style="color: #888; padding: 6px 0; width: 140px;">Name:</td><td style="color: #fff; font-weight: bold;">${contact.name}</td></tr>
          <tr><td style="color: #888; padding: 6px 0;">Email:</td><td><a href="mailto:${contact.email}" style="color: #38bdf8;">${contact.email}</a></td></tr>
          <tr><td style="color: #888; padding: 6px 0;">Company:</td><td style="color: #fff;">${contact.company || "None specified"}</td></tr>
          <tr><td style="color: #888; padding: 6px 0;">Project Type:</td><td style="color: #fff;">${contact.project_type}</td></tr>
          <tr><td style="color: #888; padding: 6px 0;">Budget:</td><td style="color: #fff;">${contact.budget || "Not specified"}</td></tr>
        </table>
        <div style="margin-top: 20px; padding: 14px; background: #141414; border-radius: 8px; border: 1px solid #262626;">
          <strong style="color: #888; font-size: 12px; text-transform: uppercase;">Message:</strong>
          <p style="color: #eee; margin-top: 8px; white-space: pre-wrap; font-size: 14px; line-height: 1.5;">${contact.message}</p>
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">Submitted at: ${new Date(contact.created_at).toLocaleString()}</p>
      </div>
    `,
  });
}

export async function notifyAdminEscalatedChat(options: {
  visitorName: string;
  visitorEmail: string;
  question: string;
  sessionId: string;
}): Promise<void> {
  const settings = await getSettings();
  const to = settings.admin_notification_email || settings.smtp_user;
  if (!to) return;

  await sendEmail({
    to,
    subject: `[Hush AI Escalation] Visitor Question from ${options.visitorName}`,
    html: `
      <div style="font-family: sans-serif; background: #0a0a0a; color: #f5f5f5; padding: 24px; border-radius: 12px; border: 1px solid #333;">
        <h2 style="color: #fff; margin-top: 0; border-bottom: 1px solid #333; padding-bottom: 12px;">Hush AI · Escalated Question Requiring Follow-up</h2>
        <p style="color: #ccc; font-size: 14px;">A website visitor asked a question that was escalated to human follow-up. The AI informed them that our team will be in touch shortly.</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
          <tr><td style="color: #888; padding: 6px 0; width: 140px;">Visitor Name:</td><td style="color: #fff; font-weight: bold;">${options.visitorName}</td></tr>
          <tr><td style="color: #888; padding: 6px 0;">Visitor Email:</td><td><a href="mailto:${options.visitorEmail}" style="color: #38bdf8;">${options.visitorEmail}</a></td></tr>
          <tr><td style="color: #888; padding: 6px 0;">Chat Session ID:</td><td style="font-family: monospace; color: #fff;">${options.sessionId}</td></tr>
        </table>
        <div style="margin-top: 20px; padding: 14px; background: #141414; border-radius: 8px; border: 1px solid #262626;">
          <strong style="color: #888; font-size: 12px; text-transform: uppercase;">Visitor Question:</strong>
          <p style="color: #eee; margin-top: 8px; white-space: pre-wrap; font-size: 14px; line-height: 1.5;">${options.question}</p>
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">You can view and reply to this conversation in your Hush Admin Dashboard at /admin.</p>
      </div>
    `,
  });
}

