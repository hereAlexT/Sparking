import { $getNearestNodeOfType } from "@lexical/utils";
import { corePluginHooks, GenericHTMLNode } from "@mdxeditor/editor";
import { MdxJsxAttribute } from "mdast-util-mdx";
import React, { useEffect } from "react";

/**
 * This component is from offical doc
 * https://mdxeditor.dev/editor/docs/html-support.
 * It is not working though, leave here for future use.
 */
const HTMLToolbarComponent = () => {
  const [currentSelection, activeEditor] = corePluginHooks.useEmitterValues(
    "currentSelection",
    "activeEditor",
  );

  const currentHTMLNode = React.useMemo(() => {
    return (
      activeEditor?.getEditorState().read(() => {
        const selectedNodes = currentSelection?.getNodes() || [];
        if (selectedNodes.length === 1) {
          return $getNearestNodeOfType(selectedNodes[0], GenericHTMLNode);
        } else {
          return null;
        }
      }) || null
    );
  }, [currentSelection, activeEditor]);

  useEffect(() => {
    console.log(currentHTMLNode);
  }, [currentHTMLNode]);

  return (
    <>
      <input
        disabled={currentHTMLNode === null}
        value={getCssClass(currentHTMLNode)}
        onChange={(e) => {
          activeEditor?.update(
            () => {
              const attributesWithoutClass =
                currentHTMLNode
                  ?.getAttributes()
                  .filter((attr: any) => attr.name !== "class") || [];
              const newClassAttr: MdxJsxAttribute = {
                type: "mdxJsxAttribute",
                name: "class",
                value: e.target.value,
              };
              currentHTMLNode?.updateAttributes([
                ...attributesWithoutClass,
                newClassAttr,
              ]);
            },
            { discrete: true },
          );
          e.target.focus();
        }}
      />
    </>
  );
};

function getCssClass(node: GenericHTMLNode | null) {
  return (
    (node?.getAttributes().find((attr: any) => attr.name === "class")
      ?.value as string) ?? ""
  );
}

export default HTMLToolbarComponent;
