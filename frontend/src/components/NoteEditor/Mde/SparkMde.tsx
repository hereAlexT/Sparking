import SimpleMdeReact from "./SimpleMdeReact";
import "./sparkmde.css";
import SimpleMDE, { Options } from "easymde";
import EasyMDE from "easymde";
import React from "react";
import { useMemo, useRef } from "react";

interface SparkMdeProps {
  // Define the props for the SparkMde component here
}

const SparkMde: React.FC<SparkMdeProps> = () => {
  const editorRef = useRef<SimpleMDE | null>(null);

  const getMdeInstance = (editor: SimpleMDE) => {
    editorRef.current = editor;
  };

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
      toolbar: toolbar,
    } as SimpleMDE.Options;
  }, []);

  const handleBoldClick = () => {
    console.log(editorRef.current);
    (editorRef.current as any)?.toggleBold();
  };
  return (
    <>
      <SimpleMdeReact options={MdeOptions} getMdeInstance={getMdeInstance} />
      <button
        onClick={handleBoldClick}
        className="bg-blue-500 p-3 text-white active:bg-blue-950"
      >
        Bold
      </button>
    </>
  );
};

export default SparkMde;
