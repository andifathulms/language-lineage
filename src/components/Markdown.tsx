import ReactMarkdown, { type Components } from "react-markdown";

// Content convention: inline code (`…`) is a phonetic/reconstructed form and
// renders in the IPA face as real, selectable text.
const ipaCode: Components["code"] = ({ children }) => <span className="ipa">{children}</span>;

const blockComponents: Components = { code: ipaCode };

const inlineComponents: Components = {
  code: ipaCode,
  p: ({ children }) => <>{children}</>,
};

/** Block-level markdown for chapter bodies. */
export function Prose({ children }: { children: string }) {
  return (
    <div className="prose-grown">
      <ReactMarkdown components={blockComponents}>{children}</ReactMarkdown>
    </div>
  );
}

/** Single-paragraph markdown for descriptions and evidence text. */
export function InlineMarkdown({ children }: { children: string }) {
  return <ReactMarkdown components={inlineComponents}>{children}</ReactMarkdown>;
}
