import React from "react";

interface EditorButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const EditorButton: React.FC<EditorButtonProps> = ({ onClick, children }) => {
  return (
    <button
      className="flex h-7 w-7 items-center justify-center hover:bg-slate-200"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default EditorButton;
