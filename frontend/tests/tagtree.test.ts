import { initTagTree, insertTag, deleteTag, tagsDiff } from '../src/shared/utils/tagTree';
import { Note, NOTE_STATUS } from '../src/shared/types';

describe('TagTree', () => {
    let note1: Note;
    let note2: Note;

    beforeEach(() => {
        note1 = { id: '1', body: 'Content 1', userId: '1', createdAt: new Date(), updatedAt: new Date(), status: NOTE_STATUS.UNSYNCED };
        note2 = { id: '2', body: 'Content 2', userId: '1', createdAt: new Date(), updatedAt: new Date(), status: NOTE_STATUS.UNSYNCED };
    });

    test('initTagTree should initialize a tag tree with a root node', () => {
        const tree = initTagTree();
        expect(tree.root).toEqual({ name: "", notes: [], children: [] });
    });

    test('insertTag should add a tag to the tree', () => {
        let tree = initTagTree();
        tree = insertTag(tree, '#tag1', note1);
        expect(tree.root.children[0]).toEqual({ name: 'tag1', notes: [note1], children: [] });
    });

    test('insertTag should handle multiple tags', () => {
        let tree = initTagTree();
        tree = insertTag(tree, '#tag1', note2);
        tree = insertTag(tree, '#tag1/tag2', note1);
        expect(tree.root.children[0].children[0]).toEqual({ name: 'tag2', notes: [note1], children: [] });
    });

    test('insertTag should prevent inserting the same note to the same node twice', () => {
        let tree = initTagTree();
        tree = insertTag(tree, '#tag1', note1);
        tree = insertTag(tree, '#tag1', note1);
        console.dir(tree, { depth: null });
        expect(tree.root.children[0].notes.length).toBe(1);
    });


    test('insertTag should add a tag to the tree under the correct parent', () => {
        let tree = initTagTree();
        tree = insertTag(tree, '#tag1/tag2', note1);
        expect(tree.root.children[0].children[0]).toEqual({ name: 'tag2', notes: [note1], children: [] });
    });

    test('deleteTag should remove a note from a tag', () => {
        let tree = initTagTree();
        tree = insertTag(tree, '#tag1', note1);
        tree = deleteTag(tree, '#tag1', note1);
        console.dir(tree, { depth: null });
        expect(tree.root.children.length).toBe(0);
    });

    test('deleteTag should not remove a note if the tag does not exist', () => {
        let tree = initTagTree();
        tree = insertTag(tree, '#tag1', note1);
        tree = deleteTag(tree, '#tag2', note1);
        expect(tree.root.children[0].notes.length).toBe(1);
    });
});


