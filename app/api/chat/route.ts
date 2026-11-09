import { NextResponse } from "next/server";
import {
  getChatSession,
  saveChatSession,
  type ChatSession,
  type ChatMessage,
} from "@/lib/store";
import { askGroqAI } from "@/lib/groq";
import { notifyAdminEscalatedChat } from "@/lib/email";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
  }

  const session = await getChatSession(sessionId);
  if (!session) {
    return NextResponse.json({ session: null });
  }

  return NextResponse.json({ session });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, visitorName, visitorEmail, message } = body;

    if (!sessionId || !visitorName || !visitorEmail || !message) {
      return NextResponse.json(
        { error: "sessionId, visitorName, visitorEmail, and message are required." },
        { status: 400 }
      );
    }

    const cleanName = String(visitorName).trim();
    const cleanEmail = String(visitorEmail).trim().toLowerCase();
    const cleanMessage = String(message).trim();

    let session = await getChatSession(sessionId);
    const now = new Date().toISOString();

    if (!session) {
      session = {
        id: sessionId,
        visitor_name: cleanName,
        visitor_email: cleanEmail,
        created_at: now,
        updated_at: now,
        status: "active",
        messages: [],
      };
    }

    // Append visitor message
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}_u`,
      sender: "visitor",
      text: cleanMessage,
      created_at: now,
    };
    session.messages.push(userMsg);

    // Query Groq AI
    const { reply, escalated } = await askGroqAI({
      visitorName: cleanName,
      visitorEmail: cleanEmail,
      userMessage: cleanMessage,
      history: session.messages,
    });

    const aiMsg: ChatMessage = {
      id: `msg_${Date.now()}_a`,
      sender: "ai",
      text: reply,
      created_at: new Date().toISOString(),
      escalated,
    };
    session.messages.push(aiMsg);

    if (escalated) {
      session.status = "escalated";
      // Send async SMTP escalation notification to admin
      notifyAdminEscalatedChat({
        visitorName: cleanName,
        visitorEmail: cleanEmail,
        question: cleanMessage,
        sessionId,
      }).catch((err) =>
        console.error("notifyAdminEscalatedChat background failure:", err)
      );
    }

    await saveChatSession(session);

    return NextResponse.json({ reply, session });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("POST /api/chat error:", msg);
    return NextResponse.json(
      { error: "Failed to process chat message." },
      { status: 500 }
    );
  }
}

