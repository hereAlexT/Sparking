import clsx from "clsx";
import React from "react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula as highliter } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

interface NoteContentProps {
  note: {
    body: string;
  };
}

const NoteContent: React.FC<NoteContentProps> = ({ note }) => {
  const syntaxHighlighterRef = React.useRef(null);

  return (
    <div>
      <Markdown
        rehypePlugins={[rehypeKatex]}
        remarkPlugins={[remarkMath]}
        className={clsx(
          "prose prose-neutral font-poppins text-sm dark:prose-invert",
          "prose-h1:text-2xl",
          "prose-h2:text-xl",
          "prose-h3:text-lg",
          "prose-h4:text-base prose-h4:font-bold",
          "prose-h5:text-base prose-h5:font-normal",
          "prose-h6:text-base prose-h6:font-light",
        )}
        children={note.body}
        components={{
          code(props) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <SyntaxHighlighter
                {...rest}
                ref={syntaxHighlighterRef}
                PreTag="div"
                children={String(children).replace(/\n$/, "")}
                language={match[1]}
                style={highliter}
              />
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            );
          },
        }}
      />
    </div>
  );
};

export default NoteContent;
