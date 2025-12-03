import React from "react";

// --- Inline Component Helpers ---
const InlineCode = ({ content }) => (
  <code className="bg-purple-200 px-1 py-0.5 rounded text-purple-700 text-sm font-mono">
    {content}
  </code>
);

// --- Core Logic for Inline Formatting ---
const processInlineFormatting = (line) => {
  // Regex: Match inline code, bold, italic, strikethrough
  const regex =
    /(\`{1,2}[^`]*\`{1,2})|(\*\*[^\*]+\*\*)|(\*[^\*]+\*)|(\_\_[^\_]+\_\_)|(\_[^\_]+\_)|(\~\~[^\~]+\~\~)/g;

  const segments = [];
  let currentIndex = 0;
  let match;

  while ((match = regex.exec(line)) !== null) {
    const fullMatch = match[0];
    const matchIndex = match.index;

    if (matchIndex > currentIndex) {
      segments.push(line.slice(currentIndex, matchIndex));
    }

    let content = "";
    let element = null;

    if (match[1]) {
      // Inline Code
      content = fullMatch.replace(/^`{1,2}|`{1,2}$/g, "");
      element = <InlineCode key={segments.length} content={content} />;
    } else if (match[2]) {
      // Bold
      content = fullMatch.slice(2, -2);
      element = (
        <strong key={segments.length} className="font-medium text-slate-800">
          {content}
        </strong>
      );
    } else if (match[3] || match[5]) {
      // Italic
      content = fullMatch.slice(1, -1);
      element = (
        <em key={segments.length} className="italic text-slate-700">
          {content}
        </em>
      );
    } else if (match[6]) {
      // Strikethrough
      content = fullMatch.slice(2, -2);
      element = (
        <span key={segments.length} className="line-through text-slate-500">
          {content}
        </span>
      );
    }

    if (element) {
      segments.push(element);
    } else {
      segments.push(fullMatch);
    }

    currentIndex = matchIndex + fullMatch.length;
  }

  if (currentIndex < line.length) {
    segments.push(line.slice(currentIndex));
  }

  return segments.length > 0 ? segments : line;
};

// --- Code Block Extractor ---
export const formatCodeBlocks = (text) => {
  // Split the text by the code block delimiter (```)
  const parts = text.split(/(```[\s\S]*?```)/g);

  return parts.map((part, index) => {
    if (part.startsWith("```")) {
      // Code block processing
      const match = part.match(/```(\w*)\n([\s\S]*?)```/);
      const language = match ? match[1] : "";
      const code = match ? match[2].trim() : part.replace(/```/g, "").trim();

      return (
        <div key={index} className="my-4">
          <pre className="bg-gray-800 p-4 rounded text-white overflow-x-auto text-sm font-mono">
            <code data-language={language}>{code}</code>
          </pre>
        </div>
      );
    } else {
      // Regular text processing
      return formatTextLines(part, index);
    }
  });
};

// --- Main Line Processing Logic with Block Grouping ---
const formatTextLines = (text, parentKey) => {
  if (!text || text.trim() === "") {
    return <React.Fragment key={parentKey} />;
  }

  const lines = text.split("\n").filter((line) => line.length > 0);
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const key = `${parentKey}-${i}`;

    // 1. Horizontal Rules
    if (line.trim() === "---" || line.trim() === "***") {
      elements.push(<hr key={key} className="w-full my-4 border-gray-300" />);
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

    // 4. Ordered Lists Grouping (Fixes numbering)
    if (/^\s*\d+\.\s/.test(line)) {
      const listItems = [];
      let j = i;

      while (j < lines.length && /^\s*\d+\.\s/.test(lines[j])) {
        const liKey = `${key}-${j}`;
        const content = lines[j].replace(/^\s*\d+\.\s/, "").trim();
        listItems.push(
          <li key={liKey} className="text-slate-700 mb-1">
            {processInlineFormatting(content)}
          </li>
        );
        j++;
      }

      elements.push(
        <ol key={`ol-${key}`} className="my-2 ml-8 list-decimal">
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

      while (
        j < lines.length &&
        (lines[j].trim().startsWith("* ") ||
          lines[j].trim().startsWith("+ ") ||
          lines[j].trim().startsWith("- "))
      ) {
        const liKey = `${key}-${j}`;
        const content = lines[j].trim().substring(2).trim();
        listItems.push(
          <li key={liKey} className="text-slate-700 mb-1">
            {processInlineFormatting(content)}
          </li>
        );
        j++;
      }

      elements.push(
        <ul key={`ul-${key}`} className="my-2 ml-8 list-disc">
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

    // 7. Regular Paragraph - Using my-2 for consistent spacing
    elements.push(
      <p key={key} className="my-2 text-slate-700">
        {processInlineFormatting(line)}
      </p>
    );
    i++;
  }

  return elements;
};
