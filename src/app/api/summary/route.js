import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req) {
  try {
    const {
      data,
      title,
      description,
      language = "english",
      model,
    } = await req.json();

    if (!model)
      return NextResponse.json({
        ok: false,
        message: "No model defined",
      });

    const result = await ai.models.generateContent({
      model: model,
      contents: `You are a **professional video summarizer**. Given the *transcript* of a video, produce two summaries:

1. Begin with the heading **"Brief Summary"** (formatted as ### Brief Summary) and provide 3 to 5 sentences capturing the most important points.
2. Then include the heading **"Detailed Summary"** (formatted as ### Detailed Summary) and provide a full, detailed explanation preserving all key arguments, quotes, and insights.
      - If the video is a **tutorial, coding session, or educational lecture**, present the detailed summary as **clear, well-written notes** that thoroughly cover all concepts, steps, and explanations discussed.
- NB: Both the headings must use ### markdown level. All other headings (sub-headings) (if any) must use #### or smaller.

Formatting rules:
- Use standard paragraphs for explanations.
- Use bullet points ONLY for listing distinct items (e.g., methods, features, steps) or quoting specific examples/points.
- Use emojis and line breaks for clarity when appropriate, especially in the Detailed Summary. Try to always add a relatable emoji to every sub-heading (before the sub-heading text) inside of "Detailed Summary", e.g. '#### <emoji> <text>'.
- If the video is a tutorial (coding, DIY, educational, etc.), then include detailed and well-described steps/sections inside 'Detailed Summary'.

---

### Code and Technical Formatting Rules (Apply ONLY when code/technical content is present)

- **IMPORTANT FORMATTING RULE**: For code snippets, file names, commands, or technical terms that should be highlighted:
  - Wrap them in backticks like \`code\`, NOT in HTML tags.
  - Example: \`npm install express\`, \`package.json\`, \`process.env.PORT\`
  - **NEVER use HTML tags like <code>, <pre>, or any other HTML elements**.

#### CODE BLOCK GUIDELINES:

1.  **Inline Backticks (\`code\`):** Use ONLY for short single items such as variable names, file names, properties, commands, single-line definitions, or short expressions.
2.  **Triple-Backtick Blocks (\`\`\`language):** Use for multi-line code, configuration blocks, structured data, or multiple consecutive lines that form **one logical, reproducible unit**.
3.  **The Reproducibility Principle:** When the transcript describes a multi-step process or a standard structure (like boilerplate, configuration setup, or full function definitions), include **all related lines together** inside the same triple-backtick block.
    - **Specific Rule for Boilerplate:** If the video repeatedly shows a basic structure (for example: a Mongoose schema definition/export or a basic component setup), capture the **complete, representative boilerplate** in a single code block the *first* time it's introduced, even if the video breaks the explanation into theoretical parts. This gives the user a working starting point. Afterwards you can explain each part separately if you feel the need of it.
4.  **Clarity Rule:** If grouping related items into a block (even if they appear slightly separated in the transcript) improves clarity and preserves the structural context of the code, use the multi-line block.

---

Do **not** include:
- Greetings of any kind.
- Personal commentary of any kind.
- Any introductory lines such as "Here are the summaries...", "Summary:", "Below is the summary:", etc.
- Any text before the **Brief Summary** heading.
- **ANY HTML TAGS** — only use markdown formatting (headings, bold, italic, backticks, bullet points).

If the transcript contains spelling mistakes, infer the correct meaning using the video title or description when available. Especially if it is a product related video or some link, always check the correct spelling from the given metadata.

Settings:
- Output language: ${language}

${title && "Video title: " + title}
${description && "Video description: " + description}
Video transcript to summarize: ${data}
`,
    });

    return NextResponse.json({
      ok: true,
      data: result?.text,
    });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json({
      ok: false,
      message: error?.message || "Unknown Error",
      error,
    });
  }
}
