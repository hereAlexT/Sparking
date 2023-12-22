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

const TagTreeView: React.FC = () => {
  const [expandedIds, setExpandedIds] = useState();
  const { tagTree, setTagTree } = useNotes();

  // Flatten the tagTree to be used with TreeView
  const data = flattenTree(tagTree.root);

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      getAndSetIds();
    }
  };

  const getAndSetIds = () => {
    setExpandedIds(
      document
        .querySelector("#txtIdsToExpand")
        .value.split(",")
        .filter((val) => !!val.trim())
        .map((x) => {
          if (isNaN(parseInt(x.trim()))) {
            return x;
          }
          return parseInt(x.trim());
        }),
    );
  };

  return (
    <div>
      <div className="directory">
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
            <div {...getNodeProps()} style={{ paddingLeft: 20 * (level - 1) }}>
              {isBranch ? (
                <div className="flex items-center">
                  <FolderIcon isOpen={isExpanded} />
                  <span>{element.name}</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <span>{element.name}</span>
                </div>
              )}
            </div>
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
