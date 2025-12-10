import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req) {
  try {
    const { data, title, description, language = "english" } = await req.json();

    // console.log(title, description);

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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
