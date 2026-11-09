import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/session";
import { getSettings, saveSettings } from "@/lib/store";
import { sendTestEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  if (!(await getAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getSettings();
  return NextResponse.json({
    settings: {
      ...settings,
      groq_api_key: settings.groq_api_key ? "•".repeat(8) + settings.groq_api_key.slice(-4) : "",
      smtp_pass: settings.smtp_pass ? "••••••••" : "",
      has_groq_key: Boolean(settings.groq_api_key),
      has_smtp_pass: Boolean(settings.smtp_pass),
    },
  });
}

export async function POST(req: NextRequest) {
  if (!(await getAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const current = await getSettings();

    const updates: Record<string, unknown> = {};

    if (body.groq_api_key !== undefined) {
      // If user passed a non-masked value, update it
      if (body.groq_api_key && !body.groq_api_key.includes("•")) {
        updates.groq_api_key = String(body.groq_api_key).trim();
      } else if (body.groq_api_key === "") {
        updates.groq_api_key = "";
      }
    }

    if (body.groq_model !== undefined) {
      updates.groq_model = String(body.groq_model).trim();
    }

    if (body.ai_system_instructions !== undefined) {
      updates.ai_system_instructions = String(body.ai_system_instructions);
    }

    if (body.smtp_host !== undefined) {
      updates.smtp_host = String(body.smtp_host).trim();
    }

    if (body.smtp_port !== undefined) {
      updates.smtp_port = Number(body.smtp_port) || 587;
    }

    if (body.smtp_secure !== undefined) {
      updates.smtp_secure = Boolean(body.smtp_secure);
    }

    if (body.smtp_user !== undefined) {
      updates.smtp_user = String(body.smtp_user).trim();
    }

    if (body.smtp_pass !== undefined) {
      if (body.smtp_pass && !body.smtp_pass.includes("•")) {
        updates.smtp_pass = String(body.smtp_pass);
      } else if (body.smtp_pass === "") {
        updates.smtp_pass = "";
      }
    }

    if (body.smtp_from !== undefined) {
      updates.smtp_from = String(body.smtp_from).trim();
    }

    if (body.admin_notification_email !== undefined) {
      updates.admin_notification_email = String(body.admin_notification_email).trim();
    }

    const saved = await saveSettings(updates);
    return NextResponse.json({ success: true, settings: saved });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// Test SMTP endpoint
export async function PUT(req: NextRequest) {
  if (!(await getAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { targetEmail } = await req.json();
    const settings = await getSettings();
    const emailToSend = targetEmail || settings.admin_notification_email || settings.smtp_user;

    if (!emailToSend) {
      return NextResponse.json(
        { error: "Provide a recipient email address to send test email." },
        { status: 400 }
      );
    }

    const result = await sendTestEmail(emailToSend);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to send email" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `Test email sent successfully to ${emailToSend}` });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

