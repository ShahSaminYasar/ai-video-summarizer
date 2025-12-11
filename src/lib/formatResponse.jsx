import React from "react";

// --- Inline Component Helpers ---
const InlineCode = ({ content }) => (
  <code className="bg-amber-100 px-1 py-px rounded text-amber-600 text-xs font-space font-medium">
    {content}
  </code>
);

// --- Block Code Component ---
const BlockCode = ({ content, language = "" }) => (
  <div className="my-4">
    <pre className="bg-gray-900 p-4 rounded-sm text-white/95 overflow-x-auto text-xs font-space">
      <code data-language={language} className="font-medium">
        {content}
      </code>
    </pre>
  </div>
);

// --- Process inline formatting for text (backticks, bold, italic, etc.) ---
const processInlineFormatting = (text) => {
  // This handles markdown (backticks, bold, italic, etc.)

  // Process in order: backticks first, then other formatting
  const segments = [];
  let currentIndex = 0;

  // Look for the next formatting element
  while (currentIndex < text.length) {
    // Find the next special character
    const nextBacktick = text.indexOf("`", currentIndex);
    const nextDoubleAsterisk = text.indexOf("**", currentIndex);
    const nextSingleAsterisk = text.indexOf("*", currentIndex);
    const nextDoubleUnderscore = text.indexOf("__", currentIndex);
    const nextSingleUnderscore = text.indexOf("_", currentIndex);
    const nextTilde = text.indexOf("~~", currentIndex);

    // Find the earliest formatting marker
    const markers = [
      { pos: nextBacktick, type: "backtick", length: 1 },
      { pos: nextDoubleAsterisk, type: "doubleAsterisk", length: 2 },
      { pos: nextSingleAsterisk, type: "singleAsterisk", length: 1 },
      { pos: nextDoubleUnderscore, type: "doubleUnderscore", length: 2 },
      { pos: nextSingleUnderscore, type: "singleUnderscore", length: 1 },
      { pos: nextTilde, type: "tilde", length: 2 },
    ]
      .filter((m) => m.pos !== -1 && m.pos >= currentIndex)
      .sort((a, b) => a.pos - b.pos);

    if (markers.length === 0) {
      // No more formatting markers, add remaining text
      segments.push(text.slice(currentIndex));
      break;
    }

    const marker = markers[0];

    // Add plain text before the marker
    if (marker.pos > currentIndex) {
      segments.push(text.slice(currentIndex, marker.pos));
    }

    // Handle the formatted section
    if (marker.type === "backtick") {
      // Find the closing backtick
      const closingIndex = text.indexOf("`", marker.pos + 1);
      if (closingIndex !== -1) {
        const content = text.slice(marker.pos + 1, closingIndex);
        segments.push(
          <InlineCode key={`code-${marker.pos}`} content={content} />
        );
        currentIndex = closingIndex + 1;
      } else {
        // No closing backtick, add as plain text
        segments.push(text.slice(marker.pos, marker.pos + 1));
        currentIndex = marker.pos + 1;
      }
    } else if (marker.type === "doubleAsterisk") {
      // Find the closing **
      const closingIndex = text.indexOf("**", marker.pos + 2);
      if (closingIndex !== -1) {
        const content = text.slice(marker.pos + 2, closingIndex);
        // Recursively process content for nested formatting (like backticks)
        const processedContent = processInlineFormatting(content);
        segments.push(
          <strong
            key={`bold-${marker.pos}`}
            className="font-medium text-slate-800"
          >
            {processedContent}
          </strong>
        );
        currentIndex = closingIndex + 2;
      } else {
        // No closing **, add as plain text
        segments.push(text.slice(marker.pos, marker.pos + 2));
        currentIndex = marker.pos + 2;
      }
    } else if (marker.type === "singleAsterisk") {
      // Find the closing *
      const closingIndex = text.indexOf("*", marker.pos + 1);
      if (closingIndex !== -1 && closingIndex !== marker.pos) {
        const content = text.slice(marker.pos + 1, closingIndex);
        const processedContent = processInlineFormatting(content);
        segments.push(
          <em key={`italic-${marker.pos}`} className="italic text-slate-700">
            {processedContent}
          </em>
        );
        currentIndex = closingIndex + 1;
      } else {
        // No closing *, add as plain text
        segments.push(text.slice(marker.pos, marker.pos + 1));
        currentIndex = marker.pos + 1;
      }
    } else if (marker.type === "doubleUnderscore") {
      // Find the closing __
      const closingIndex = text.indexOf("__", marker.pos + 2);
      if (closingIndex !== -1) {
        const content = text.slice(marker.pos + 2, closingIndex);
        const processedContent = processInlineFormatting(content);
        segments.push(
          <strong
            key={`bold2-${marker.pos}`}
            className="font-medium text-slate-800"
          >
            {processedContent}
          </strong>
        );
        currentIndex = closingIndex + 2;
      } else {
        segments.push(text.slice(marker.pos, marker.pos + 2));
        currentIndex = marker.pos + 2;
      }
    } else if (marker.type === "singleUnderscore") {
      // Find the closing _
      const closingIndex = text.indexOf("_", marker.pos + 1);
      if (closingIndex !== -1 && closingIndex !== marker.pos) {
        const content = text.slice(marker.pos + 1, closingIndex);
        const processedContent = processInlineFormatting(content);
        segments.push(
          <em key={`italic2-${marker.pos}`} className="italic text-slate-700">
            {processedContent}
          </em>
        );
        currentIndex = closingIndex + 1;
      } else {
        segments.push(text.slice(marker.pos, marker.pos + 1));
        currentIndex = marker.pos + 1;
      }
    } else if (marker.type === "tilde") {
      // Find the closing ~~
      const closingIndex = text.indexOf("~~", marker.pos + 2);
      if (closingIndex !== -1) {
        const content = text.slice(marker.pos + 2, closingIndex);
        const processedContent = processInlineFormatting(content);
        segments.push(
          <span
            key={`strike-${marker.pos}`}
            className="line-through text-slate-500"
          >
            {processedContent}
          </span>
        );
        currentIndex = closingIndex + 2;
      } else {
        segments.push(text.slice(marker.pos, marker.pos + 2));
        currentIndex = marker.pos + 2;
      }
    }
  }

  return segments.length > 0 ? segments : text;
};

// --- Main Line Processing Logic ---
const formatTextLines = (text, parentKey) => {
  if (!text || text.trim() === "") {
    return [];
  }

  // First, let's handle any code blocks that might be in the text
  // But we need to be careful not to break lists
  const lines = text.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (line.trim() === "") {
      i++;
      continue;
    }

    const key = `${parentKey}-${i}`;

    // 1. Check for code blocks
    if (line.trim().startsWith("```")) {
      // Collect the entire code block
      const codeBlockLines = [];
      codeBlockLines.push(line);
      i++;

      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeBlockLines.push(lines[i]);
        i++;
      }

      if (i < lines.length) {
        codeBlockLines.push(lines[i]); // Add the closing ```
      }

      const codeBlockText = codeBlockLines.join("\n");
      const match = codeBlockText.match(/```(\w*)\n([\s\S]*?)```/);
      const language = match ? match[1] : "";
      const code = match
        ? match[2].trim()
        : codeBlockText.replace(/```/g, "").trim();

      elements.push(
        <BlockCode key={`code-${key}`} content={code} language={language} />
      );
      i++;
      continue;
    }

    // 2. Headings (#, ##, ...)
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = processInlineFormatting(headingMatch[2].trim());
      const HeadingTag = `h${level}`;

      const classes = {
        1: "text-3xl font-extrabold text-slate-800 mt-8 mb-4 border-b pb-2 border-slate-200",
        2: "text-2xl font-bold text-slate-800 mt-6 mb-3",
        3: "text-xl font-semibold text-slate-800 mt-5 mb-2",
        4: "text-lg font-medium text-slate-800 mt-4 mb-2",
        5: "text-md font-medium text-slate-800 mt-3 mb-1",
        6: "text-md font-normal text-slate-800 mt-3 mb-1",
      };

      elements.push(
        React.createElement(
          HeadingTag,
          { key, className: classes[level] },
          content
        )
      );
      i++;
      continue;
    }

    // 3. Handle standalone bolded lines as H4
    if (/^\s*\*\*.*?\*\*\s*$/.test(line)) {
      const content = line.trim().replace(/^\*\*(.*?)\*\*$/, "$1");
      elements.push(
        <h4 key={key} className="text-lg font-medium text-slate-800 mt-4 mb-2">
          {processInlineFormatting(content)}
        </h4>
      );
      i++;
      continue;
    }

    // 4. Ordered Lists with nested content
    if (/^\s*\d+\.\s/.test(line)) {
      const listItems = [];
      let j = i;
      let listCounter = 0;

      // Process all consecutive numbered lines
      while (j < lines.length && /^\s*\d+\.\s/.test(lines[j])) {
        listCounter++;
        const liKey = `${key}-item-${listCounter}`;
        const content = lines[j].replace(/^\s*\d+\.\s/, "").trim();

        // Collect any nested content (bullet points, code blocks) that follow
        const nestedContent = [];
        let k = j + 1;
        let nestedListCounter = 0;

        while (
          k < lines.length &&
          !/^\s*\d+\.\s/.test(lines[k]) && // Not a new numbered item
          !/^\s*#{1,6}\s/.test(lines[k]) && // Not a heading
          (lines[k].trim() === "" || // Empty line (continuation)
            lines[k].match(/^\s{4,}/) || // Indented line
            lines[k].trim().startsWith("* ") || // Bullet point
            lines[k].trim().startsWith("+ ") || // Bullet point
            lines[k].trim().startsWith("- ") || // Bullet point
            lines[k].trim().startsWith("```")) // Code block
        ) {
          // Skip empty lines (they're allowed in lists)
          if (lines[k].trim() === "") {
            k++;
            continue;
          }

          // Check for code blocks
          if (lines[k].trim().startsWith("```")) {
            const codeBlockLines = [];
            codeBlockLines.push(lines[k]);
            k++;

            while (k < lines.length && !lines[k].trim().startsWith("```")) {
              codeBlockLines.push(lines[k]);
              k++;
            }

            if (k < lines.length) {
              codeBlockLines.push(lines[k]); // Add the closing ```
            }

            const codeBlockText = codeBlockLines.join("\n");
            const match = codeBlockText.match(/```(\w*)\n([\s\S]*?)```/);
            const language = match ? match[1] : "";
            const code = match
              ? match[2].trim()
              : codeBlockText.replace(/```/g, "").trim();

            nestedContent.push(
              <BlockCode
                key={`${liKey}-code-${k}`}
                content={code}
                language={language}
              />
            );
            k++;
            continue;
          }

          // Check for bullet points
          if (
            lines[k].trim().startsWith("* ") ||
            lines[k].trim().startsWith("+ ") ||
            lines[k].trim().startsWith("- ")
          ) {
            const nestedItems = [];
            let nestedItemCounter = 0;

            while (
              k < lines.length &&
              (lines[k].trim().startsWith("* ") ||
                lines[k].trim().startsWith("+ ") ||
                lines[k].trim().startsWith("- "))
            ) {
              nestedItemCounter++;
              const nestedKey = `${liKey}-nested-item-${nestedItemCounter}`;
              const nestedContentText = lines[k].trim().substring(2).trim();
              nestedItems.push(
                <li key={nestedKey} className="text-slate-700 mb-1 ml-4">
                  {processInlineFormatting(nestedContentText)}
                </li>
              );
              k++;
            }

            if (nestedItems.length > 0) {
              nestedListCounter++;
              nestedContent.push(
                <ul
                  key={`${liKey}-nested-list-${nestedListCounter}`}
                  className="my-2 ml-8 list-disc"
                >
                  {nestedItems}
                </ul>
              );
            }
            continue;
          }

          // Handle indented text (continuation of list item)
          const indentedText = lines[k].trim();
          nestedContent.push(
            <p
              key={`${liKey}-indented-${k}`}
              className="my-1 text-slate-700 ml-4"
            >
              {processInlineFormatting(indentedText)}
            </p>
          );
          k++;
        }

        // Build the main list item
        listItems.push(
          <li key={liKey} className="text-slate-700 mb-3">
            {processInlineFormatting(content)}
            {nestedContent.length > 0 && (
              <div className="mt-1">{nestedContent}</div>
            )}
          </li>
        );

        j = k; // Skip the nested content we've already processed
      }

      elements.push(
        <ol key={`ol-${key}-${listCounter}`} className="my-2 ml-8 list-decimal">
          {listItems}
        </ol>
      );
      i = j;
      continue;
    }

    // 5. Unordered Lists Grouping
    if (
      line.trim().startsWith("* ") ||
      line.trim().startsWith("+ ") ||
      line.trim().startsWith("- ")
    ) {
      const listItems = [];
      let j = i;
      let ulItemCounter = 0;

      while (
        j < lines.length &&
        (lines[j].trim().startsWith("* ") ||
          lines[j].trim().startsWith("+ ") ||
          lines[j].trim().startsWith("- "))
      ) {
        ulItemCounter++;
        const liKey = `${key}-ul-item-${ulItemCounter}`;
        const content = lines[j].trim().substring(2).trim();
        listItems.push(
          <li key={liKey} className="text-slate-700 mb-1">
            {processInlineFormatting(content)}
          </li>
        );
        j++;
      }

      elements.push(
        <ul key={`ul-${key}-${ulItemCounter}`} className="my-2 ml-8 list-disc">
          {listItems}
        </ul>
      );
      i = j;
      continue;
    }

    // 6. Blockquotes (>)
    if (line.trim().startsWith(">")) {
      const content = line.trim().substring(1).trim();
      elements.push(
        <blockquote
          key={key}
          className="pl-4 border-l-4 border-slate-400 italic text-slate-600 my-2"
        >
          {processInlineFormatting(content)}
        </blockquote>
      );
      i++;
      continue;
    }

    // 7. Regular Paragraph
    elements.push(
      <p key={key} className="my-2 text-slate-700">
        {processInlineFormatting(line)}
      </p>
    );

    i++;
  }

  return elements;
};

// --- Code Block Extractor ---
export const formatCodeBlocks = (text) => {
  // We're now handling code blocks in formatTextLines directly
  // So this function just delegates to formatTextLines
  return formatTextLines(text, "root");
};
