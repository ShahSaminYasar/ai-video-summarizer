import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { synthwave84 } from "react-syntax-highlighter/dist/esm/styles/prism";

import "katex/dist/katex.min.css";

export default function MarkdownRenderer({ children }) {
  if (!children) return null;
  const content = typeof children === "string" ? children : String(children);

  return (
    <div className="text-sm text-slate-700 font-space font-normal code-block-wrapper">
      <Markdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // --- CODE BLOCKS ---
          code(props) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !className;

            if (isInline) {
              return (
                <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-600 text-xs font-medium font-mono">
                  {children}
                </code>
              );
            }

            return (
              <div className="my-4 relative rounded-lg overflow-hidden border border-slate-800 shadow-md">
                {match && (
                  <div className="absolute right-4 top-2 z-10 text-[10px] uppercase tracking-widest text-white/30 font-bold select-none">
                    {match[1]}
                  </div>
                )}
                <SyntaxHighlighter
                  {...rest}
                  PreTag="div"
                  language={match ? match[1] : "text"}
                  style={synthwave84}
                  codeTagProps={{
                    style: { fontFamily: "'JetBrains Mono', monospace" },
                  }}
                  customStyle={{
                    margin: 0,
                    padding: "1rem",
                    fontSize: "0.8rem", // Slightly smaller for code looks better
                    lineHeight: "1.5",
                    backgroundColor: "#0f172a",
                  }}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            );
          },

          // --- HEADINGS (Explicitly sized, won't be affected by parent text-sm) ---
          h1: ({ children }) => (
            <h1 className="text-3xl font-extrabold text-slate-900 mt-8 mb-4 border-b pb-2 border-slate-200">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-3">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-slate-800 mt-5 mb-2">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-semibold text-slate-800 mt-4 mb-2">
              {children}
            </h4>
          ),

          // --- BODY ELEMENTS (Inherit text-sm from parent) ---
          p: ({ children }) => {
            const isStandaloneBold =
              React.Children.count(children) === 1 &&
              React.isValidElement(children[0]) &&
              (children[0].type === "strong" ||
                children[0].props?.node?.tagName === "strong");

            if (isStandaloneBold) {
              return (
                <h4 className="text-lg font-bold text-slate-800 mt-4 mb-2">
                  {children}
                </h4>
              );
            }
            return <p className="my-3">{children}</p>;
          },

          ul: ({ children }) => (
            <ul className="my-3 ml-6 list-disc space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-3 ml-6 list-decimal space-y-1">{children}</ol>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,

          blockquote: ({ children }) => (
            <blockquote className="pl-4 py-1 border-l-4 border-amber-400 italic bg-amber-50/50 text-slate-500 my-4">
              {children}
            </blockquote>
          ),

          strong: ({ children }) => (
            <strong className="font-bold text-slate-900">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
