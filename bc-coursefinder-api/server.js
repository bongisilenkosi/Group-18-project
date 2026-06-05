const express = require("express");
const cors = require("cors");
const MiniSearch = require("minisearch");
const data = require("./data.json");
const applyGuardrails = require("./guardrails");

const app = express();
app.use(cors());
app.use(express.json());

/* -----------------------------
   BUILD SEARCH INDEX
   Runs once at startup.
------------------------------*/
const documents = data.map((item, index) => ({
  id: index,
  topic: item.topic,
  searchText: [item.topic.replace(/_/g, " "), ...item.keywords].join(" "),
  answer: item.answer,
}));

const miniSearch = new MiniSearch({
  fields: ["searchText"],
  storeFields: ["topic", "answer"],
  searchOptions: {
    prefix: true,
    fuzzy: 0.2,
    boost: { searchText: 2 },
  },
});

miniSearch.addAll(documents);
console.log(`✅ Search index built with ${documents.length} entries`);

/* -----------------------------
   SESSION MEMORY
   Stores programme context per
   session so follow-up questions
   work without repeating context.
   (In-memory — replace with Redis
    for multi-instance production.)
------------------------------*/
const sessions = {};

const PROGRAMME_KEYWORDS = {
  BComp: ["bcomp", "bachelor of computing", "data science", "software engineering", "nqf 8"],
  BIT: ["bit", "bachelor of it", "bachelor of information technology", "weekday degree"],
  "Part-Time BIT": ["part time", "part-time", "saturday", "saturday classes"],
  "Diploma IT": ["diploma", "it diploma", "diploma in it", "infrastructure"],
  "Deaf Diploma": ["deaf", "hearing impaired", "sign language", "sasl"],
};

function detectProgramme(text) {
  const lower = text.toLowerCase();
  for (const [programme, keywords] of Object.entries(PROGRAMME_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return programme;
  }
  return null;
}

/* -----------------------------
   EMOTIONAL SUPPORT DETECTION
   Catches distress phrases before
   the knowledge base is queried.
------------------------------*/
const EMOTIONAL_PHRASES = [
  "failed",
  "confused",
  "worried",
  "scared",
  "stressed",
  "don't know what to do",
  "dont know what to do",
  "lost",
  "hopeless",
  "anxious",
  "overwhelmed",
  "no idea",
  "not sure what to do",
  "feeling stuck",
];

function isEmotionalMessage(text) {
  const lower = text.toLowerCase();
  return EMOTIONAL_PHRASES.some((phrase) => lower.includes(phrase));
}

/* -----------------------------
   PULL RELEVANT CONTEXT
   MiniSearch finds the top 3
   most relevant knowledge base
   entries for the question.
------------------------------*/
function getContext(question, sessionProgramme) {
  // Enrich query with stored programme so follow-ups stay on topic
  const enrichedQuery = sessionProgramme
    ? `${question} ${sessionProgramme}`
    : question;

  const results = miniSearch.search(enrichedQuery, { limit: 3 });
  if (!results.length) return null;

  return results
    .map((r) => `Topic: ${r.topic}\nInfo: ${r.answer}`)
    .join("\n\n");
}

/* -----------------------------
   STRIP MARKDOWN (safety net)
   Cleans any stray markdown that
   slips through the prompt rules.
------------------------------*/
function stripMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")          // bold
    .replace(/\*(.*?)\*/g, "$1")               // italic
    .replace(/^#{1,6}\s+/gm, "")              // headers
    .replace(/^\s*[-*+]\s+/gm, "")            // bullet points
    .replace(/^\s*\d+\.\s+/gm, "")            // numbered lists
    .replace(/`{1,3}[^`]*`{1,3}/g, "$1")     // inline & block code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links
    .replace(/\n{3,}/g, "\n\n")               // excessive newlines
    .replace(/\n\n/g, " ")                    // double newlines → space
    .trim();
}

/* -----------------------------
   ASK OLLAMA
   Sends the question + context
   to the local Llama model.
   Ollama runs at localhost:11434
------------------------------*/
async function askOllama(question, context, sessionProgramme) {
  const sessionHint = sessionProgramme
    ? `The student has previously shown interest in the ${sessionProgramme} programme. Use this as context if relevant.\n\n`
    : "";

  const prompt = `You are a helpful assistant for Belgium Campus iTversity, a South African IT college.

You MUST only answer using the information provided below. Do not use any outside knowledge.
If the information below is not enough to answer, say: "I don't have that information. Please contact Belgium Campus at 010 593 5368 or info@belgiumcampus.ac.za"

IMPORTANT FORMATTING RULES:
- Write in plain text only. No markdown whatsoever.
- Do not use bullet points, dashes, asterisks, bold, headers, or numbered lists.
- Do not use symbols like *, **, #, or -.
- Write in clear, flowing sentences and paragraphs only.
- Keep answers concise and easy to read.

Answer the question properly - if comparing two things, give a real comparison. If asking for a recommendation, reason and recommend. Do not just copy paste the info, construct a proper helpful answer.

${sessionHint}--- KNOWLEDGE BASE ---
${context}
--- END ---

Question: ${question}
Answer:`;

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2",
      prompt: prompt,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.statusText}`);
  }

  const result = await response.json();
  return result.response.trim();
}

/* -----------------------------
   ROOT ROUTE
------------------------------*/
app.get("/", (req, res) => {
  res.send("BC CourseFinder API is running ✅");
});

/* -----------------------------
   CHAT ROUTE
------------------------------*/
app.post("/chat", async (req, res) => {
  const { message: userMessage, sessionId } = req.body;

  if (!userMessage) {
    return res.json({ reply: "Please send a message." });
  }

  // --- Session init ---
  const sid = sessionId || "default";
  if (!sessions[sid]) sessions[sid] = { programme: null };
  const session = sessions[sid];

  // --- Emotional support check (before guardrails) ---
  if (isEmotionalMessage(userMessage)) {
    return res.json({
      reply:
        "It sounds like you're feeling overwhelmed, and that's completely understandable. Choosing a career path is a big decision and it is okay to feel uncertain. Belgium Campus has friendly advisors who can walk you through your options at no pressure. Please reach out at 010 593 5368 or info@belgiumcampus.ac.za — they are there to help.",
    });
  }

  // --- Guardrails check ---
  const guard = applyGuardrails(userMessage);
  if (!guard.allowed) {
    return res.json({ reply: guard.reply });
  }

  // --- Update session programme if detected ---
  const detectedProgramme = detectProgramme(userMessage);
  if (detectedProgramme) {
    session.programme = detectedProgramme;
  }

  // --- Find relevant knowledge base entries ---
  const context = getContext(userMessage, session.programme);

  if (!context) {
    return res.json({
      reply:
        "I don't have information on that. Please contact Belgium Campus at 010 593 5368 or info@belgiumcampus.ac.za for help.",
    });
  }

  try {
    // Ask local Ollama model to reason over the context
    const rawAnswer = await askOllama(userMessage, context, session.programme);

    // Strip any markdown that slipped through
    const answer = stripMarkdown(rawAnswer);

    res.json({ reply: answer, sessionId: sid });
  } catch (error) {
    console.error("Ollama error:", error.message);
    res.status(500).json({
      reply:
        "Something went wrong. Make sure Ollama is running with: ollama serve",
    });
  }
});

/* -----------------------------
   START SERVER
------------------------------*/
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});