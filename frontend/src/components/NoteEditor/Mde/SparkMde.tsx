import SimpleMdeReact from "./SimpleMdeReact";
import "./sparkmde.css";
import SimpleMDE, { Options } from "easymde";
import EasyMDE from "easymde";
import React from "react";
import { useMemo, useRef, useImperativeHandle } from "react";

interface SparkMdeProps {
  // Define the props for the SparkMde component here
}

const SparkMde = React.forwardRef(({}, ref) => {
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
      <SimpleMdeReact options={MdeOptions} getMdeInstance={getMdeInstance} />
      {/* <button
        onClick={() => {
          (editorRef.current as any)?.toggleBold();
        }}
        className="bg-blue-500 p-3 text-white active:bg-blue-950"
      >
        Bold
      </button> */}
    </>
  );
});

export default SparkMde;
