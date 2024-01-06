import { useNotes } from "../contexts/NotesContext";
import "./TagTreeView.css";
import { IonIcon } from "@ionic/react";
import cx from "classnames";
import {
  caretForwardOutline as caretForwardOutlineIcon,
  caretDownOutline as caretDownOutlineIcon,
} from "ionicons/icons";
import React from "react";
import { useState, useEffect } from "react";
import TreeView, { flattenTree } from "react-accessible-treeview";
import { FaList, FaRegFolder, FaRegFolderOpen } from "react-icons/fa";
import { IoMdArrowDropright } from "react-icons/io";
import { Link } from "react-router-dom";

const TagTreeView: React.FC = () => {
  const { tagTree, setTagTree } = useNotes();
  console.log(tagTree);

  // Flatten the tagTree to be used with TreeView
  const data = flattenTree(tagTree.root);
  return (
    <div>
      <div className="directory">
        <div className="mb-1 font-bold">Tags:</div>
        <TreeView
          data={data}
          aria-label="directory tree"
          onBlur={({ treeState, dispatch }) => {
            dispatch({
              type: "DESELECT",
              id: Array.from(treeState.selectedIds)[0],
            });
          }}
          nodeRenderer={({
            element,
            isBranch,
            isExpanded,
            getNodeProps,
            level,
          }) => (
            <Link to={`/timeline/pri/?search=%23${element.metadata?.fullTag}`}>
              <div
                {...getNodeProps()}
                style={{ paddingLeft: 20 * (level - 1) }}
              >
                {isBranch ? (
                  <div className="mb-1 flex w-full items-center gap-y-4 rounded-lg text-slate-700 hover:bg-slate-200">
                    <FolderIcon isOpen={isExpanded} />
                    <span className="">#{element.name}</span>
                  </div>
                ) : (
                  <div className="mb-1 w-full gap-y-4 rounded-lg text-slate-700 hover:bg-slate-200">
                    <span className="">#{element.name}</span>
                  </div>
                )}
              </div>
            </Link>
          )}
        />
      </div>
    </div>
  );
};

interface FolderIconProps {
  isOpen: boolean;
}

const FolderIcon: React.FC<FolderIconProps> = ({ isOpen }) =>
  isOpen ? (
    <IonIcon icon={caretDownOutlineIcon} />
  ) : (
    <IonIcon icon={caretForwardOutlineIcon} />
  );

export default TagTreeView;
