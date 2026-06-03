import express from "express";
import path from "path";

const app = express();
const PORT = 3000;

app.use(express.json());

// API health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Lazy loader for Google GenAI client to handle missing key gracefully
let aiClient: any = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required to generate AI insights.");
    }
    // Correct import and instantiation as per gemini-api skill rules
    const { GoogleGenAI } = require("@google/genai");
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// AI Financial Assistant Endpoint
app.post("/api/insights", async (req, res) => {
  try {
    const { transactions, summary, businessName } = req.body;

    const client = getGeminiClient();
    
    // Construct a highly detailed context for Gemini 3.5 Flash
    const prompt = `You are FinTrack AI, an elite SaaS financial advisory assistant for small and medium enterprises (SMEs).
You are analyzing the financial data of "${businessName || "the business"}".

--- BUSINESS SUMMARY ---
- Total Revenue: $${summary?.totalRevenue || 0}
- Total Expenses: $${summary?.totalExpenses || 0}
- Net Profit: $${summary?.netProfit || 0}
- Cash Balance: $${summary?.cashBalance || 0}

--- RECENT TRANSACTIONS ---
${transactions && transactions.length > 0 
  ? transactions.map((t: any) => `Date: ${t.date} | Type: ${t.type} | Amount: $${t.amount} | Category: ${t.category} | Description: ${t.description || "N/A"}`).join("\n")
  : "No recent transactions logged."
}

Please provide a highly professional, beautifully formatted, comprehensive financial audit of the business. 
Structure your response as a rich analysis with the following specific sections of markdown:
1. **Executive Financial Summary**: Provide a plain-language summary of the business's overall health and growth prospects based on the revenue-to-expense profile.
2. **Key Financial Ratios & Diagnostics**: Estimate simple margins (e.g. profit margin) or metrics and interpret them.
3. **Anomalies & Overspending Detection**: Highlight any suspicious patterns, high spending categories (e.g., Marketing, Utilities, salaries, inventory), or potential waste. 
4. **Actionable Cost-Saving Opportunities**: Recommend 3 practical, concrete steps this business can take to save money.
5. **Profit Growth Strategies**: Suggest 2 realistic ways the business can optimize revenue growth based on its category profiles.

Keep your tone professional, constructive, encouraging, clear, and focused on helping a non-accountant business owner understand their finances instantly. Do not display dry boilerplate codes, use warm bullet points and beautiful structures.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({
      success: true,
      insight: response.text || "No insights generated. Try logging some transactions first!"
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(error.message?.includes("GEMINI_API_KEY") ? 401 : 500).json({
      success: false,
      error: error.message || "An unexpected error occurred while analyzing finances."
    });
  }
});

// Setup Vite Dev server middleware or serve production client files
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite live middleware...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode with built assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FinTrack Server listening at http://localhost:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error("Failed to start server:", err);
});
