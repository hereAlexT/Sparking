import { Note } from "../types"

export interface TagNode {
    name: string;
    notes: Note[];
    children: TagNode[];
}


export interface TagTree {
    root: TagNode;
}

export const initTagTree = (): TagTree => {
    return { root: { name: "", notes: [], children: [] } };
}

export const insertTag = (tagTree: TagTree, tag: string, note: Note): TagTree => {
    const tagNames = tag.replace("#", '').split("/");
    let currentNode = tagTree.root;

    for (let tagName of tagNames) {
        let found = currentNode.children.find(child => child.name === tagName);

        if (!found) {
            found = { name: tagName, notes: [], children: [] };
            currentNode.children.push(found);
        }

        currentNode = found;
    }

    // Check if the note already exists in the current node
    if (!currentNode.notes.find(existingNote => existingNote.id === note.id)) {
        currentNode.notes.push(note);
    }

    return tagTree;
}

export const deleteTag = (tagTree: TagTree, tag: string, note: Note): TagTree => {
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

    currentNode.notes = currentNode.notes.filter(n => n.id !== note.id);

    // If the current node has no notes and no children, remove it from its parent's children array
    if (currentNode.notes.length === 0 && currentNode.children.length === 0 && parentNode) {
        parentNode.children = parentNode.children.filter(child => child !== currentNode);
    }

    return tagTree;
}

export const tagsDiff = (oldTags: string[], newTags: string[]): { added: string[], removed: string[] } => {
    const added = newTags.filter(tag => !oldTags.includes(tag));
    const removed = oldTags.filter(tag => !newTags.includes(tag));

    return { added, removed };
}