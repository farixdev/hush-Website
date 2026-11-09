import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/session";
import {
  listChatSessions,
  getChatSession,
  saveChatSession,
  type ChatMessage,
} from "@/lib/store";

export async function GET(req: NextRequest) {
  if (!(await getAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessions = await listChatSessions();
  return NextResponse.json({ sessions });
}

export async function POST(req: NextRequest) {
  if (!(await getAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { sessionId, replyText } = await req.json();
    if (!sessionId || !replyText) {
      return NextResponse.json(
        { error: "sessionId and replyText are required." },
        { status: 400 }
      );
    }

    const session = await getChatSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: "Session not found." }, { status: 404 });
    }

    const adminMsg: ChatMessage = {
      id: `msg_${Date.now()}_adm`,
      sender: "admin",
      text: String(replyText).trim(),
      created_at: new Date().toISOString(),
    };

    session.messages.push(adminMsg);
    session.status = "active";
    await saveChatSession(session);

    return NextResponse.json({ success: true, session });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

