import { TagTree, initTagTree, insertTag } from "./tagTree";
import { Note } from "../types";
import TagTreeView from "../../components/TagTreeView";

const TAG_REGEX = /#[\w\/_\\\.]+/g;
const CODE_BLOCK_REGEX = /```[\s\S]*?```|`[\s\S]*?`/g;


export const extractTags = (content: string): string[] => {
    const nonCodeBlockParts = content.split(CODE_BLOCK_REGEX);
    const tags: string[] = [];

    nonCodeBlockParts.forEach(part => {
        const matches = part.match(TAG_REGEX);
        if (matches) {
            tags.push(...matches);
        }
    })
    return tags;
}


export const modifyTags = (content: string, tag: string, newTag: string): string => {
    const tagRegex = new RegExp(`#${tag}\\b`, 'g');
    const codeParts = content.match(CODE_BLOCK_REGEX) || [];
    const nonCodeParts = content.split(CODE_BLOCK_REGEX).map(part => part.replace(tagRegex, `#${newTag}`));
    let finalParts = [];
    for (let i = 0; i < nonCodeParts.length; i++) {
        finalParts.push(nonCodeParts[i]);
        if (codeParts[i]) {
            finalParts.push(codeParts[i]);
        }
    }
    return finalParts.join('');
}


/**
 * Replace tags in the content with the given html tag. It deson't convert the tag in code blocks.
 * @param content rendered content
 */
export const tagToHtml = (content: string, className: string): string => {

    // check second content whether start with "\#", if so ,remove the first character "/"
    if (content.startsWith('\\#')) {
        content = content.slice(1);
    }

    const codeParts = content.match(CODE_BLOCK_REGEX) || [];
    const nonCodeParts = content.split(CODE_BLOCK_REGEX).map(part => part.replace(TAG_REGEX, (match) => `<span class="${className}">#${match.slice(1)}</span>`));
    let finalParts = [];
    for (let i = 0; i < nonCodeParts.length; i++) {
        finalParts.push(nonCodeParts[i]);
        if (codeParts[i]) {
            finalParts.push(codeParts[i]);
        }
    }
    return finalParts.join('');
}

export const tagsDiff = (oldTags: string[], newTags: string[]): { added: string[], removed: string[] } => {
    const added = newTags.filter(tag => !oldTags.includes(tag));
    const removed = oldTags.filter(tag => !newTags.includes(tag));

    return { added, removed };
}

export const buildIndex = (notes: Note[]): TagTree => {
    let tagTree = initTagTree();

    for (let note of notes) {
        extractTags(note.body).forEach(tag => {
            insertTag(tagTree, tag, note.id);
        });
    }
    return tagTree;
}

