// Persistence store for Settings, Contact Submissions, and Visitor Chat Sessions.
// Uses Neon Postgres when DATABASE_URL is set, otherwise JSON files in .data/.

export type AppSettings = {
  groq_api_key: string;
  groq_model: string;
  ai_system_instructions: string;
  smtp_host: string;
  smtp_port: number;
  smtp_secure: boolean;
  smtp_user: string;
  smtp_pass: string;
  smtp_from: string;
  admin_notification_email: string;
};

export type ContactInquiry = {
  id: string;
  name: string;
  email: string;
  company: string;
  project_type: string;
  budget: string;
  message: string;
  created_at: string;
  read: boolean;
};

export type ChatMessage = {
  id: string;
  sender: "visitor" | "ai" | "admin";
  text: string;
  created_at: string;
  escalated?: boolean;
};

export type ChatSession = {
  id: string;
  visitor_name: string;
  visitor_email: string;
  created_at: string;
  updated_at: string;
  status: "active" | "escalated" | "resolved";
  messages: ChatMessage[];
};

const DEFAULT_SETTINGS: AppSettings = {
  groq_api_key: process.env.GROQ_API_KEY || "",
  groq_model: "llama-3.3-70b-versatile",
  ai_system_instructions: `You are the official AI assistant for Hush (https://hush.app), a zero-knowledge private messaging app for Android developed by Edge Brain Software (https://www.edgebrainsoftware.com, case study: https://www.edgebrainsoftware.com/work/hush).

KEY HUSH KNOWLEDGE:
- Purpose: Ephemeral, zero-trace, peer-to-peer messaging and encrypted voice calls for Android.
- Tagline: "Quiet. Private. Gone."
- 1-on-1 Codes: Ephemeral 6-digit alphanumeric codes (e.g. 65VVJ8) that automatically expire every 2 minutes ("new in 1:55").
- Pseudonyms: Randomized whimsical throwaway names (e.g. "Cinnamon Macaron") that can be re-rolled anytime.
- Private Groups: Group rooms identified by room codes (e.g. H8KSVQ), multi-party end-to-end encryption, group voice calls, and an hourglass timer for self-destructing messages.
- Nearby Mode: Works offline with zero internet. Discovers peers on the same local Wi-Fi subnet via mDNS, or switches directly to Bluetooth Low Energy (BLE) mesh without Wi-Fi or cellular connection.
- Ephemeral Purge: Everything lives exclusively in RAM. Tapping "Leave" destroys session keys and wipes conversations permanently.
- No Google Play dependency: Distributed as a direct standalone APK, avoiding Google Play Services telemetry. 100% free with no ads.
- Built by Edge Brain Software: Edge Brain Software builds custom high-security, privacy-first mobile apps, peer-to-peer protocols, and enterprise software.

GUARDRAILS & ESCALATION RULE:
- Keep answers concise, helpful, and polite.
- Do NOT provide general unrelated coding help, math trivia, or answer questions completely outside Hush, privacy messaging, or Edge Brain Software services.
- If the visitor asks a completely different/off-topic question, asks for bespoke software development pricing/proposals, or requires human assistance:
  Reply exactly: "Our team will be in touch with you shortly at {visitor_email} regarding this."
  and append the token [ESCALATE] at the very end of your response so our team is notified.`,
  smtp_host: process.env.SMTP_HOST || "",
  smtp_port: Number(process.env.SMTP_PORT || 587),
  smtp_secure: process.env.SMTP_SECURE === "true",
  smtp_user: process.env.SMTP_USER || "",
  smtp_pass: process.env.SMTP_PASS || "",
  smtp_from: process.env.SMTP_FROM || "Hush Support <support@edgebrainsoftware.com>",
  admin_notification_email: process.env.ADMIN_NOTIFICATION_EMAIL || "",
};

const useNeon = !!process.env.DATABASE_URL;

// ─────────────────────────────── Neon ───────────────────────────────
let _sql: ReturnType<typeof import("@neondatabase/serverless").neon> | null = null;
let _schemaInit: Promise<void> | null = null;

async function getSql() {
  if (!_sql) {
    const { neon } = await import("@neondatabase/serverless");
    _sql = neon(process.env.DATABASE_URL!);
  }
  if (!_schemaInit) {
    _schemaInit = (async () => {
      await _sql!`
        CREATE TABLE IF NOT EXISTS app_settings (
          id INT PRIMARY KEY DEFAULT 1,
          data JSONB NOT NULL DEFAULT '{}'::jsonb
        );
        CREATE TABLE IF NOT EXISTS contact_inquiries (
          id TEXT PRIMARY KEY,
          data JSONB NOT NULL DEFAULT '{}'::jsonb,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
        CREATE TABLE IF NOT EXISTS chat_sessions (
          id TEXT PRIMARY KEY,
          visitor_name TEXT NOT NULL,
          visitor_email TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'active',
          data JSONB NOT NULL DEFAULT '{}'::jsonb,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `;
    })();
  }
  await _schemaInit;
  return _sql!;
}

// ──────────────────────────── Local JSON Fallback ────────────────────────────
async function getJsonPaths() {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const dir = path.join(process.cwd(), ".data");
  await fs.mkdir(dir, { recursive: true });
  return {
    fs,
    settingsFile: path.join(dir, "settings.json"),
    contactsFile: path.join(dir, "contacts.json"),
    chatsFile: path.join(dir, "chats.json"),
  };
}

// ─────────────────────────────── SETTINGS API ───────────────────────────────
export async function getSettings(): Promise<AppSettings> {
  if (useNeon) {
    try {
      const s = await getSql();
      const rows = (await s`SELECT data FROM app_settings WHERE id = 1`) as Record<string, unknown>[];
      if (rows && rows.length > 0) {
        return { ...DEFAULT_SETTINGS, ...(rows[0].data as Partial<AppSettings>) };
      }
    } catch (err) {
      console.error("Neon getSettings error:", err);
    }
    return DEFAULT_SETTINGS;
  }

  const { fs, settingsFile } = await getJsonPaths();
  try {
    const raw = await fs.readFile(settingsFile, "utf8");
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<AppSettings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(updates: Partial<AppSettings>): Promise<AppSettings> {
  const current = await getSettings();
  const next: AppSettings = { ...current, ...updates };

  if (useNeon) {
    const s = await getSql();
    await s`
      INSERT INTO app_settings (id, data)
      VALUES (1, ${JSON.stringify(next)})
      ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(next)}
    `;
    return next;
  }

  const { fs, settingsFile } = await getJsonPaths();
  await fs.writeFile(settingsFile, JSON.stringify(next, null, 2), "utf8");
  return next;
}

// ─────────────────────────────── CONTACT INQUIRIES API ───────────────────────────────
export async function listContacts(): Promise<ContactInquiry[]> {
  if (useNeon) {
    try {
      const s = await getSql();
      const rows = (await s`SELECT id, data FROM contact_inquiries ORDER BY created_at DESC`) as { id: string; data: ContactInquiry }[];
      return rows.map((r) => r.data);
    } catch {
      return [];
    }
  }

  const { fs, contactsFile } = await getJsonPaths();
  try {
    const raw = await fs.readFile(contactsFile, "utf8");
    return JSON.parse(raw) as ContactInquiry[];
  } catch {
    return [];
  }
}

export async function createContact(
  input: Omit<ContactInquiry, "id" | "created_at" | "read">
): Promise<ContactInquiry> {
  const item: ContactInquiry = {
    ...input,
    id: `contact_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    created_at: new Date().toISOString(),
    read: false,
  };

  if (useNeon) {
    const s = await getSql();
    await s`
      INSERT INTO contact_inquiries (id, data, created_at)
      VALUES (${item.id}, ${JSON.stringify(item)}, ${item.created_at})
    `;
    return item;
  }

  const { fs, contactsFile } = await getJsonPaths();
  const list = await listContacts();
  list.unshift(item);
  await fs.writeFile(contactsFile, JSON.stringify(list, null, 2), "utf8");
  return item;
}

export async function markContactRead(id: string): Promise<void> {
  if (useNeon) {
    const s = await getSql();
    const rows = (await s`SELECT data FROM contact_inquiries WHERE id = ${id}`) as Record<string, unknown>[];
    if (rows && rows.length > 0) {
      const data = rows[0].data as ContactInquiry;
      data.read = true;
      await s`UPDATE contact_inquiries SET data = ${JSON.stringify(data)} WHERE id = ${id}`;
    }
    return;
  }

  const { fs, contactsFile } = await getJsonPaths();
  const list = await listContacts();
  const target = list.find((c) => c.id === id);
  if (target) {
    target.read = true;
    await fs.writeFile(contactsFile, JSON.stringify(list, null, 2), "utf8");
  }
}

// ─────────────────────────────── CHAT SESSIONS API ───────────────────────────────
export async function listChatSessions(): Promise<ChatSession[]> {
  if (useNeon) {
    try {
      const s = await getSql();
      const rows = (await s`SELECT id, data FROM chat_sessions ORDER BY updated_at DESC`) as { id: string; data: ChatSession }[];
      return rows.map((r) => r.data);
    } catch {
      return [];
    }
  }

  const { fs, chatsFile } = await getJsonPaths();
  try {
    const raw = await fs.readFile(chatsFile, "utf8");
    return JSON.parse(raw) as ChatSession[];
  } catch {
    return [];
  }
}

export async function getChatSession(id: string): Promise<ChatSession | null> {
  if (useNeon) {
    try {
      const s = await getSql();
      const rows = (await s`SELECT data FROM chat_sessions WHERE id = ${id}`) as Record<string, unknown>[];
      if (rows && rows.length > 0) {
        return rows[0].data as ChatSession;
      }
    } catch {
      return null;
    }
    return null;
  }

  const list = await listChatSessions();
  return list.find((c) => c.id === id) ?? null;
}

export async function saveChatSession(session: ChatSession): Promise<ChatSession> {
  session.updated_at = new Date().toISOString();

  if (useNeon) {
    const s = await getSql();
    await s`
      INSERT INTO chat_sessions (id, visitor_name, visitor_email, status, data, created_at, updated_at)
      VALUES (${session.id}, ${session.visitor_name}, ${session.visitor_email}, ${session.status}, ${JSON.stringify(session)}, ${session.created_at}, ${session.updated_at})
      ON CONFLICT (id) DO UPDATE SET
        visitor_name = ${session.visitor_name},
        visitor_email = ${session.visitor_email},
        status = ${session.status},
        data = ${JSON.stringify(session)},
        updated_at = ${session.updated_at}
    `;
    return session;
  }

  const { fs, chatsFile } = await getJsonPaths();
  const list = await listChatSessions();
  const idx = list.findIndex((c) => c.id === session.id);
  if (idx >= 0) {
    list[idx] = session;
  } else {
    list.unshift(session);
  }
  await fs.writeFile(chatsFile, JSON.stringify(list, null, 2), "utf8");
  return session;
}
