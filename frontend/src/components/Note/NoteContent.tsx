import { tagToHtml } from "../../shared/utils/tag";
import clsx from "clsx";
import React from "react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula as highliter } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
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
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        remarkPlugins={[remarkMath]}
        className={clsx("prose", "note-preview")}
        children={tagToHtml(note.body, "tag bg-blue-300")}
        // children={note.body}
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
