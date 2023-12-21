import { useNotes } from "../contexts/NotesContext";
import "./TagTreeView.css";
import cx from "classnames";
import React from "react";
import { useState, useEffect } from "react";
import TreeView, { flattenTree } from "react-accessible-treeview";
import { IoMdArrowDropright } from "react-icons/io";

const folder = {
  name: "",
  children: [
    {
      name: "Fruits",
      children: [
        { name: "Avocados" },
        { name: "Bananas" },
        { name: "Berries" },
        { name: "Oranges" },
        { name: "Pears" },
      ],
    },
    {
      name: "Drinks",
      children: [
        { name: "Apple Juice" },
        { name: "Chocolate" },
        { name: "Coffee" },
        {
          name: "Tea",
          children: [
            { name: "Black Tea" },
            { name: "Green Tea" },
            { name: "Red Tea" },
            { name: "Matcha" },
          ],
        },
      ],
    },
    {
      name: "Vegetables",
      children: [
        { name: "Beets" },
        { name: "Carrots" },
        { name: "Celery" },
        { name: "Lettuce" },
        { name: "Onions" },
      ],
    },
  ],
};

const data = flattenTree(folder);

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
      <div className="checkbox">
        <TreeView
          data={data}
          aria-label="Controlled expanded node tree"
          expandedIds={expandedIds}
          defaultExpandedIds={[1]}
          nodeRenderer={({
            element,
            isBranch,
            isExpanded,
            isDisabled,
            getNodeProps,
            level,
            handleExpand,
          }) => {
            return (
              <div
                {...getNodeProps({ onClick: handleExpand })}
                style={{
                  marginLeft: 40 * (level - 1),
                  opacity: isDisabled ? 0.5 : 1,
                }}
              >
                {isBranch && <ArrowIcon isOpen={isExpanded} />}
                <span className="name">
                  {element.name}-{element.id}
                </span>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

const ArrowIcon = ({ isOpen, className }) => {
  const baseClass = "arrow";
  const classes = cx(
    baseClass,
    { [`${baseClass}--closed`]: !isOpen },
    { [`${baseClass}--open`]: isOpen },
    className,
  );
  return <IoMdArrowDropright className={classes} />;
};

export default TagTreeView;
