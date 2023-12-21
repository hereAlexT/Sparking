import { Note, NoteId } from "../types"

export interface TagNode {
    name: string;
    noteIds: NoteId[];
    children: TagNode[];
}


export interface TagTree {
    root: TagNode;
}

export const initTagTree = (): TagTree => {
    return { root: { name: "", noteIds: [], children: [] } };
}

export const insertTag = (tagTree: TagTree, tag: string, noteId: NoteId): TagTree => {
    const tagNames = tag.replace("#", '').split("/");
    let currentNode = tagTree.root;

    for (let tagName of tagNames) {
        let found = currentNode.children.find(child => child.name === tagName);

        if (!found) {
            found = { name: tagName, noteIds: [], children: [] };
            currentNode.children.push(found);
        }

        currentNode = found;
    }

    // Check if the noteId already exists in the current node
    if (!currentNode.noteIds.find(existingNoteId => existingNoteId === noteId)) {
        currentNode.noteIds.push(noteId);
    }

    return tagTree;
}

export const deleteTag = (tagTree: TagTree, tag: string, noteId: NoteId): TagTree => {
    const tagNames = tag.replace("#", '').split("/");
    let currentNode = tagTree.root;
    let parentNode = null;

    for (let tagName of tagNames) {
        let found = currentNode.children.find(child => child.name === tagName);

        if (!found) {
            return tagTree;
        }

        parentNode = currentNode;
        currentNode = found;
    }

    currentNode.noteIds = currentNode.noteIds.filter(id => id !== noteId);

    // If the current node has no noteIds and no children, remove it from its parent's children array
    if (currentNode.noteIds.length === 0 && currentNode.children.length === 0 && parentNode) {
        parentNode.children = parentNode.children.filter(child => child !== currentNode);
    }

    return tagTree;
}