import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req) {
  try {
    const { data, title, description, language = "english" } = await req.json();

    // console.log(title, description);

    const result = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: `You are a **professional video summarizer**. Given the *transcript* of a YouTube video, produce two summaries:

1. Begin with the heading **"Brief Summary"** (formatted as ### Brief Summary) and provide 3 to 5 sentences capturing the most important points.
2. Then include the heading **"Detailed Summary"** (formatted as ### Detailed Summary) and provide a full, detailed explanation preserving all key arguments, quotes, and insights.
- NB: Both the headings must use ### markdown level. All other headings (if any) must use #### or smaller.

Formatting rules:
- Use standard paragraphs for explanations.
- Use bullet points ONLY for listing distinct items (e.g., methods, features, steps) or quoting specific examples.
- Use emojis and line breaks for clarity when appropriate.
- If the video is a tutorial, then include detailed and well described steps inside 'Detailed Summary'.

- **IMPORTANT FORMATTING RULE**: For code snippets, file names, commands, or technical terms that should be highlighted:
  - Wrap them in backticks like \`code\`, NOT in HTML tags.
  - Example: \`npm install express\`, \`package.json\`, \`process.env.PORT\`
  - **NEVER use HTML tags like <code>, <pre>, or any other HTML elements**
  - For multi-line code blocks, use triple backticks with language specification:
    \`\`\`javascript
    const example = "code block";
    \`\`\`

CODE FORMATTING & GROUPING RULES:
1. Use inline backticks (\`code\`) ONLY for:
   - Short single items such as variable names, file names, properties, commands, or short expressions.
   - One-line code references that do not depend on surrounding lines.
2. Use multi-line triple-backtick code blocks when the transcript contains:
   - Multiple consecutive lines that clearly belong to one logical unit.
   - Any structured or formatted content that is easier to understand as a block.
   - Examples:
     • multi-line code
     • configuration blocks
     • structured data
     • lists of fields or parameters that form one object or dataset
   (These are examples only — always decide smartly whether it will look good in multiline or not - for better readability.)
3. Code completeness rule:
   - When the transcript describes a multi-step process that forms a single code block, include **all related lines together** inside the same triple-backtick block.
   - Do NOT split them into separate inline code fragments.
4. Smart decision rule:
   - Use multi-line blocks only when they improve clarity and preserve structure.
   - Use inline code for isolated items or single line codes or definitions etc.
   - If unsure, prefer a multi-line block when several related items appear back-to-back in the transcript.
5. NEVER add HTML tags. Only markdown is allowed.

Do **not** include:
- Greetings of any kind.
- Personal commentary of any kind.
- Any introductory lines such as "Here are the summaries...", "Summary:", "Below is the summary:", etc.
- Any text before the **Brief Summary** heading.
- **ANY HTML TAGS** — only use markdown formatting (headings, bold, italic, backticks, bullet points).

If the transcript contains spelling mistakes, infer the correct meaning using the video title or description when available.

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
