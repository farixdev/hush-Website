import { getSettings, type ChatMessage } from "./store";

export type GroqChatResult = {
  reply: string;
  escalated: boolean;
};

export async function askGroqAI(options: {
  visitorName: string;
  visitorEmail: string;
  userMessage: string;
  history: ChatMessage[];
}): Promise<GroqChatResult> {
  const settings = await getSettings();
  const apiKey = settings.groq_api_key || process.env.GROQ_API_KEY;

  // Fallback if no Groq API Key has been configured in Admin Settings yet
  if (!apiKey) {
    const fallbackEscalated = true;
    return {
      reply: `Hello ${options.visitorName}! Thank you for reaching out to Hush & Edge Brain Software. Our AI service is currently awaiting API key configuration in the Admin Settings. Our human engineering team will be in touch with you shortly at ${options.visitorEmail}. In the meantime, please feel free to explore our official User Manual at /docs!`,
      escalated: fallbackEscalated,
    };
  }

  const model = settings.groq_model || "llama-3.3-70b-versatile";
  const systemPrompt = settings.ai_system_instructions.replace(
    /\{visitor_email\}/g,
    options.visitorEmail
  );

  // Security guardrails: sanitize input length
  const cleanInput = options.userMessage.trim().slice(0, 1000);

  // Format messages array (system + last 6 turns of history + current message)
  const recentHistory = options.history.slice(-6).map((m) => ({
    role: m.sender === "visitor" ? "user" : "assistant",
    content: m.text.slice(0, 1000),
  }));

  const messages = [
    { role: "system", content: systemPrompt },
    ...recentHistory,
    { role: "user", content: cleanInput },
  ];

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Groq API error:", res.status, errText);
      return {
        reply: `Our team will be in touch with you shortly at ${options.visitorEmail} regarding this.`,
        escalated: true,
      };
    }

    const data = await res.json();
    let rawReply: string = data.choices?.[0]?.message?.content || "";

    // Check if the model triggered escalation
    const hasEscalateToken = rawReply.includes("[ESCALATE]");
    const isOutOfScopePhrase =
      rawReply.toLowerCase().includes("our team will be in touch") ||
      rawReply.toLowerCase().includes("team will be in touch with you shortly");

    const escalated = hasEscalateToken || isOutOfScopePhrase;

    // Clean out internal tokens
    const cleanedReply = rawReply.replace(/\[ESCALATE\]/g, "").trim();

    return {
      reply: cleanedReply || `Our team will be in touch with you shortly at ${options.visitorEmail}.`,
      escalated,
    };
  } catch (err) {
    console.error("askGroqAI network exception:", err);
    return {
      reply: `Our team will be in touch with you shortly at ${options.visitorEmail}.`,
      escalated: true,
    };
  }
}

