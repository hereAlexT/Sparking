// import SimpleMdeReact from "./SimpleMdeReact";
import "./sparkmde.css";
import { EditorChange } from "codemirror";
import EasyMDE, { Options, toggleBlockquote } from "easymde";
import React, { useEffect } from "react";
import { useMemo, useRef, useImperativeHandle } from "react";
import SimpleMDE from "react-simplemde-editor";

interface SparkMdeProps {
  onChange?: (value: string, changeObject?: EditorChange) => void;
  value?: string;
  minHeight?: string;
  maxHeight?: string;
}

const SparkMde = React.forwardRef((props: SparkMdeProps, ref) => {
  const { onChange, value, minHeight, maxHeight } = props;
  const editorRef = useRef<EasyMDE | null>(null);

  const getMdeInstance = (editor: EasyMDE) => {
    editorRef.current = editor;
  };

  const callOnEditor = (func: (editor: EasyMDE) => void) => {
    if (editorRef.current) {
      func(editorRef.current);
    }
  };

  useImperativeHandle(ref, () => ({
    toggleBold: () => {
      callOnEditor(EasyMDE.toggleBold);
    },
    toggleItalic: () => {
      callOnEditor(EasyMDE.toggleItalic);
    },
    toggleStrikethrough: () => {
      callOnEditor(EasyMDE.toggleStrikethrough);
    },
    toggleHeadingSmaller: () => {
      callOnEditor(EasyMDE.toggleHeadingSmaller);
    },
    toggleHeadingBigger: () => {
      callOnEditor(EasyMDE.toggleHeadingBigger);
    },
    toggleHeading1: () => {
      callOnEditor(EasyMDE.toggleHeading1);
    },
    toggleHeading2: () => {
      callOnEditor(EasyMDE.toggleHeading2);
    },
    toggleHeading3: () => {
      callOnEditor(EasyMDE.toggleHeading3);
    },
    toggleHeading4: () => {
      callOnEditor(EasyMDE.toggleHeading4);
    },
    toggleHeading5: () => {
      callOnEditor(EasyMDE.toggleHeading5);
    },
    toggleHeading6: () => {
      callOnEditor(EasyMDE.toggleHeading6);
    },
    toggleCodeBlock: () => {
      callOnEditor(EasyMDE.toggleCodeBlock);
    },
    toggleBlockquote: () => {
      callOnEditor(EasyMDE.toggleBlockquote);
    },
    toggleUnorderedList: () => {
      callOnEditor(EasyMDE.toggleUnorderedList);
    },
    toggleOrderedList: () => {
      callOnEditor(EasyMDE.toggleOrderedList);
    },
    cleanBlock: () => {
      callOnEditor(EasyMDE.cleanBlock);
    },
    drawLink: () => {
      callOnEditor(EasyMDE.drawLink);
    },
    drawImage: () => {
      callOnEditor(EasyMDE.drawImage);
    },
    drawUploadedImage: () => {
      callOnEditor(EasyMDE.drawUploadedImage);
    },
    drawTable: () => {
      callOnEditor(EasyMDE.drawTable);
    },
    drawHorizontalRule: () => {
      callOnEditor(EasyMDE.drawHorizontalRule);
    },
    togglePreview: () => {
      callOnEditor(EasyMDE.togglePreview);
    },
    toggleSideBySide: () => {
      callOnEditor(EasyMDE.toggleSideBySide);
    },
    toggleFullScreen: () => {
      callOnEditor(EasyMDE.toggleFullScreen);
    },
    undo: () => {
      callOnEditor(EasyMDE.undo);
    },
    redo: () => {
      callOnEditor(EasyMDE.redo);
    },
  }));

  const toolbar = ["bold", "italic", "heading", "|", "quote", "unordered-list"];

  const MdeOptions = useMemo(() => {
    return {
      autoDownloadFontAwesome: false,
      minHeight: minHeight || "100%",
      // maxHeight: maxHeight || "100%",
      spellChecker: false,
      lineNumbers: false,
      unorderedListStyle: "-",
      uploadImage: false,
      placeholder: "You got an idea💡? What's that?",
      status: false,
      toolbar: false,
      autofocus: true,
    } as EasyMDE.Options;
  }, []);

  return (
    <>
      <SimpleMDE
        options={MdeOptions}
        getMdeInstance={getMdeInstance}
        onChange={onChange}
        value={value}
      />
    </>
  );
});

export default SparkMde;
