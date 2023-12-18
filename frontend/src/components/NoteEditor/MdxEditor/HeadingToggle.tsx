import { Heading as HeadingIcon } from "../../Icons";
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingTagType,
} from "@lexical/rich-text";
import { corePluginHooks } from "@mdxeditor/editor";
import { $createParagraphNode } from "lexical";

export const HeadingToggle = () => {
  const convertSelectionToNode = corePluginHooks.usePublisher(
    "convertSelectionToNode",
  );
  const [currentBlockType] =
    corePluginHooks.useEmitterValues("currentBlockType");

  const handleClick = () => {
    let nextBlockType: HeadingTagType | "paragraph";

    switch (currentBlockType) {
      case "paragraph":
        nextBlockType = "h1";
        break;
      case "h1":
        nextBlockType = "h2";
        break;
      case "h2":
        nextBlockType = "h3";
        break;
      case "h3":
      default:
        nextBlockType = "paragraph";
        break;
    }

    if (nextBlockType === "paragraph") {
      console.log("Converting to paragraph node");
      convertSelectionToNode(() => $createParagraphNode());
    } else {
      console.log("Converting to heading node:", nextBlockType);
      convertSelectionToNode(() =>
        $createHeadingNode(nextBlockType as HeadingTagType),
      );
    }
  };

  return <button onClick={handleClick}>Heading</button>;
};

export default HeadingToggle;
