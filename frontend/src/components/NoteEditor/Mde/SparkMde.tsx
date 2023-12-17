import SimpleMdeReact from "./SimpleMdeReact";
import "./sparkmde.css";
import { EditorChange } from "codemirror";
import SimpleMDE, { Options } from "easymde";
import EasyMDE from "easymde";
import React from "react";
import { useMemo, useRef, useImperativeHandle } from "react";

interface SparkMdeProps {
  onChange?: (value: string, changeObject?: EditorChange) => void;
  value?: string;
}

const SparkMde = React.forwardRef((props: SparkMdeProps, ref) => {
  const { onChange, value } = props;
  const editorRef = useRef<SimpleMDE | null>(null);

  const getMdeInstance = (editor: SimpleMDE) => {
    editorRef.current = editor;
  };

  useImperativeHandle(ref, () => ({
    toggleBold: () => {
      (editorRef.current as any)?.toggleBold();
    },
    toggleItalic: () => {
      (editorRef.current as any)?.toggleItalic();
    },
  }));

  const toolbar = ["bold", "italic", "heading", "|", "quote", "unordered-list"];

  const MdeOptions = useMemo(() => {
    return {
      minHeight: "50px",
      spellChecker: false,
      lineNumbers: false,
      unorderedListStyle: "-",
      uploadImage: false,
      placeholder: "You got an idea💡? What's that?",
      status: false,
      toolbar: false,
    } as SimpleMDE.Options;
  }, []);

  return (
    <>
      <SimpleMdeReact
        options={MdeOptions}
        getMdeInstance={getMdeInstance}
        onChange={onChange}
        value={value}
      />
    </>
  );
});

export default SparkMde;
