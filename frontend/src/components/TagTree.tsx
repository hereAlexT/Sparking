import { useNotes } from "../contexts/NotesContext";
import React from "react";

const TagTree: React.FC = () => {
  const { tagTree } = useNotes();
  return <div></div>;
};

export default TagTree;
