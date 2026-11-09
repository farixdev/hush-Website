import { NextResponse } from "next/server";
import { createContact } from "@/lib/store";
import { notifyAdminNewInquiry } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, company, project_type, budget, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const contact = await createContact({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      company: String(company || "").trim(),
      project_type: String(project_type || "Custom Mobile App").trim(),
      budget: String(budget || "Not specified").trim(),
      message: String(message).trim(),
    });

    // Trigger async email notification to admin via SMTP
    notifyAdminNewInquiry(contact).catch((err) =>
      console.error("notifyAdminNewInquiry background failure:", err)
    );

    return NextResponse.json({ success: true, contactId: contact.id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("POST /api/contact error:", msg);
    return NextResponse.json({ error: "Failed to submit inquiry." }, { status: 500 });
  }
}

