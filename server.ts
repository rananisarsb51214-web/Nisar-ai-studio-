import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const apiKey = process.env.GEMINI_API_KEY || "";
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }

  // Helper helper to generate content
  async function generateContentWithGemini(prompt: string, systemInstruction?: string) {
    if (!ai) {
      return "Error: GEMINI_API_KEY is not configured in the backend environment. Please verify secrets config.";
    }
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: systemInstruction ? { systemInstruction } : undefined,
      });
      return response.text || "No response received.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return `Error: ${(error as Error).message}`;
    }
  }

  // 1. AI Code Generator
  app.post("/api/generate", async (req, res) => {
    const { prompt, language } = req.body;
    const systemInstruction = "You are NISAR AI STUDIO. Generate production ready code. Rules: No copyrighted code. Include error handling. Secure by default. Add documentation. Generate complete files. Support Firebase, Node.js, Python, HTML/CSS/JS. Include rollback logic. Output ONLY the code, inside markdown code blocks.";
    const fullPrompt = `Generate clean, production-ready ${language} code based on the following instructions: ${prompt}`;
    
    const result = await generateContentWithGemini(fullPrompt, systemInstruction);
    res.json({ success: true, code: result });
  });

  // 2. Code Converter
  app.post("/api/convert", async (req, res) => {
    const { source, target, code } = req.body;
    const prompt = `Convert the following ${source} code to highly optimized ${target} code. Ensure code quality, clean syntax, and follow best practices.
Code to convert:
${code}`;
    const result = await generateContentWithGemini(prompt, "You are NISAR AI STUDIO. Output ONLY the code conversion result inside markdown code blocks.");
    res.json({ success: true, code: result });
  });

  // 3. AI Explain Code
  app.post("/api/explain", async (req, res) => {
    const { code, type } = req.body; // type can be 'line-by-line', 'bugs', 'optimize'
    let prompt = "";
    if (type === 'line-by-line') {
      prompt = `Provide a comprehensive line-by-line explanation of the following code:\n\n${code}`;
    } else if (type === 'bugs') {
      prompt = `Analyze the following code, find any bugs, vulnerabilities, or potential syntax errors, and provide corrected code suggestions:\n\n${code}`;
    } else {
      prompt = `Analyze the following code and suggest performance, memory, and structural optimizations with clean examples:\n\n${code}`;
    }
    const result = await generateContentWithGemini(prompt, "You are NISAR AI STUDIO, an expert software architect. Provide clear, detailed, and human-readable feedback.");
    res.json({ success: true, explanation: result });
  });

  // 4. AI Chat Assistant (Supports Multi-LLM personas)
  app.post("/api/chat", async (req, res) => {
    const { message, provider } = req.body; // provider: 'Claude', 'Gemini', 'OpenAI'
    const systemInstruction = `You are the ${provider} AI assistant running inside NISAR AI STUDIO. Adopt the tone and expertise of ${provider}, focusing on clean, concise, expert developer feedback.`;
    const result = await generateContentWithGemini(message, systemInstruction);
    res.json({ success: true, response: result });
  });

  // 5. Git and Firebase Terminal Simulation API
  app.post("/api/terminal", async (req, res) => {
    const { command } = req.body;
    let output = "";
    const cleanCmd = command.trim();

    if (cleanCmd.startsWith("git ")) {
      if (cleanCmd === "git init") {
        output = "Initialized empty Git repository in /workspace/nisar-ai-os/.git/\n[master (root-commit)] created.";
      } else if (cleanCmd === "git add .") {
        output = "Tracking all files: index.html, editor.html, app.js, style.css, server.js, package.json...\nReady for commit.";
      } else if (cleanCmd.startsWith("git commit")) {
        output = `[master ${Math.random().toString(16).substring(2, 8)}] commit complete: "update"\n 12 files changed, 434 insertions(+)\n create mode 100644 app.js`;
      } else if (cleanCmd === "git push origin main" || cleanCmd === "git push") {
        output = "Enumerating objects: 18, done.\nCounting objects: 100% (18/18), done.\nDelta compression using up to 8 threads\nCompressing objects: 100% (12/12), done.\nWriting objects: 100% (18/18), 4.31 KiB | 4.31 MiB/s, done.\nTotal 18 (delta 3), reused 0 (delta 0)\nTo github.com/nisarrsna/nisar-ai-studio.git\n * [new branch]      main -> main";
      } else {
        output = `Executed simulated command: ${cleanCmd}\nSuccess.`;
      }
    } else if (cleanCmd.startsWith("firebase ")) {
      if (cleanCmd === "firebase login") {
        output = "Already logged in as nisarrsna@gmail.com\nTo change accounts, run 'firebase logout'.";
      } else if (cleanCmd === "firebase init") {
        output = "=== Firebase Command Line Interface\n\nWriting configuration info to firebase.json...\nWriting project information to .firebaserc...\n\nFirebase initialization complete!";
      } else if (cleanCmd.startsWith("firebase deploy")) {
        output = "=== Deploying to 'nisar-ai-studio'...\n\n✔  hosting: dist folder uploaded successfully\n✔  firestore: rules deployed successfully\n✔  functions: sync functions activated\n\n✔  Deploy complete!\n\nHosting URL: https://nisar-ai-studio.web.app";
      } else {
        output = `Executed Firebase CLI command: ${cleanCmd}\nStatus: Success.`;
      }
    } else if (cleanCmd === "node sync/firebase-sync.js") {
      output = "Connecting to Firestore (ai-studio-4d274081-2bb2-4f5e-9ede-16331c3b321d)...\nWriting status metadata...\nDocument successfully set!\n\nSYNC OK";
    } else {
      output = `Command not recognized. Try 'git init', 'git add .', 'git commit -m \"update\"', 'git push origin main', 'firebase login', 'firebase init', 'firebase deploy', or 'node sync/firebase-sync.js'.`;
    }

    res.json({ success: true, output });
  });

  // 6. Master Automation Run Simulation
  app.post("/api/automation/run", async (req, res) => {
    const { sourceSystem, targetSystem, frequency, bidirectional, duplicateStrategy, validationRules } = req.body;
    
    // Simulate high-fidelity, comprehensive data management sync pipeline
    const timestamp = new Date().toISOString();
    const sourceRecords = Math.floor(Math.random() * 1500) + 1000;
    const targetRecords = Math.floor(Math.random() * 1200) + 800;
    
    const duplicatesDetected = Math.floor(Math.random() * 25) + 10;
    const mergedCount = duplicateStrategy === "Keep Most Complete" ? Math.floor(duplicatesDetected * 0.7) : 0;
    const flaggedCount = duplicatesDetected - mergedCount;
    
    const formatIssues = Math.floor(Math.random() * 50) + 20;
    const resolvedIssues = Math.floor(formatIssues * 0.95);
    
    const logs = [
      `[${timestamp}] INFO: Initializing Master Sync Engine pipeline...`,
      `[${timestamp}] INFO: Frequency configuration set to: ${frequency.toUpperCase()}`,
      `[${timestamp}] INFO: Connected to Source: [${sourceSystem}] | Connected to Target: [${targetSystem}]`,
      `[${timestamp}] INFO: Bidirectional synchronization mode: ${bidirectional ? "ENABLED" : "DISABLED"}`,
      `[${timestamp}] DATA: Scanning registers. Source records: ${sourceRecords} | Target records: ${targetRecords}`,
      `[${timestamp}] DUPLICATE: Scanning records for matching unique identifiers (email, ID, phone)...`,
      `[${timestamp}] DUPLICATE: Detected ${duplicatesDetected} duplicate entries. Applying strategy: "${duplicateStrategy}"`,
      duplicateStrategy === "Keep Most Complete" 
        ? `[${timestamp}] DUPLICATE: Successfully merged ${mergedCount} duplicates and generated safety backups. Flagged ${flaggedCount} for manual verification.`
        : `[${timestamp}] DUPLICATE: Strategy "${duplicateStrategy}" applied. Flagged ${flaggedCount} entries for admin approval.`,
      `[${timestamp}] CLEANING: Reviewing records for formatting errors, broken links, and inconsistencies...`,
    ];

    if (validationRules.includes("Standardize Dates")) {
      logs.push(`[${timestamp}] CLEANING: Standardized ${Math.floor(resolvedIssues * 0.4)} date fields (ISO 8601 formatting normalized).`);
    }
    if (validationRules.includes("Normalize Text")) {
      logs.push(`[${timestamp}] CLEANING: Normalized ${Math.floor(resolvedIssues * 0.3)} name and text fields (trimmed spaces, title-case applied).`);
    }
    if (validationRules.includes("Validate Contact Info")) {
      logs.push(`[${timestamp}] CLEANING: Verified and validated ${Math.floor(resolvedIssues * 0.2)} email address structures and phone patterns.`);
    }
    if (validationRules.includes("Remove Orphans")) {
      logs.push(`[${timestamp}] CLEANING: Found and pruned ${Math.floor(resolvedIssues * 0.1)} orphan records or broken database references.`);
    }

    logs.push(
      `[${timestamp}] RATE-LIMIT: Monitored API usage. Spent 142 tokens. Rate limit safe (under 150/min for standard channels).`,
      `[${timestamp}] AUDIT: Created safety rollback restore-point snapshot: 'NISAR_BAK_${Math.floor(Math.random()*900000+100000)}'`,
      `[${timestamp}] SUCCESS: Sync complete. Audit log synchronized with Firestore database.`,
      `[${timestamp}] STATUS: pipeline idle.`
    );

    res.json({
      success: true,
      stats: {
        sourceRecords,
        targetRecords,
        duplicatesDetected,
        mergedCount,
        flaggedCount,
        formatIssues,
        resolvedIssues,
        apiCost: "142 API requests (safe)"
      },
      logs
    });
  });

  // 7. Master Automation Real-World Script Generation
  app.post("/api/automation/script", async (req, res) => {
    const { sourceSystem, targetSystem, frequency, bidirectional, duplicateStrategy, validationRules, language } = req.body;
    
    const prompt = `Write a professional, production-ready, highly secure ${language} script that actually implements the data synchronization protocol between [${sourceSystem}] and [${targetSystem}].
    
PRIMARY OBJECTIVES:
1. Sync frequency: ${frequency} (include comments on how to run this on cron/scheduler)
2. Bidirectional sync: ${bidirectional ? "Enabled" : "Disabled"}
3. Duplicate Elimination strategy: "${duplicateStrategy}"
4. Data Integrity & Integrity Control:
   - Apply validations/corrections for: ${validationRules.join(", ")}
   - Specifically handle: Standardizing date formats, normalizing text (trim whitespace, title case), validating email/phone patterns, and resolving/flagging issues.
   - Include realistic API SDKs for [${sourceSystem}] and [${targetSystem}] (e.g. googleapis for Sheets/Drive, airtable npm, mysql2, or @hubspot/api-client).
   - Show how to implement API rate limit handling (e.g., retries/backoffs).
   - Implement safety backups and rollbacks.
   - Write clear loggers and a strict EMERGENCY STOP mechanism.

Make sure the code is extremely clean, comprehensive, fully documented, and robust, with explicit guides on how to setup credentials/OAuth client variables (like client_id, client_secret, API tokens, database hosts).
Output ONLY the production-ready script inside markdown code blocks.`;

    const result = await generateContentWithGemini(prompt, "You are NISAR AI STUDIO, an Elite Enterprise Software Architect. Generate fully production-ready sync integrations. Never return mock codes or incomplete functions.");
    res.json({ success: true, code: result });
  });

  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
