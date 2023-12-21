import { initTagTree, insertTag, deleteTag } from '../src/shared/utils/tagTree';
import { NoteId, NOTE_STATUS } from '../src/shared/types';

describe('TagTree', () => {
    let noteId1: NoteId;
    let noteId2: NoteId;

    beforeEach(() => {
        noteId1 = '1';
        noteId2 = '2';
    });

    test('initTagTree should initialize a tag tree with a root node', () => {
        const tree = initTagTree();
        expect(tree.root).toEqual({ name: "", noteIds: [], children: [] });
    });

    test('insertTag should add a tag to the tree', () => {
        let tree = initTagTree();
        tree = insertTag(tree, '#tag1', noteId1);
        expect(tree.root.children[0]).toEqual({ name: 'tag1', noteIds: [noteId1], children: [] });
    });

    test('insertTag should handle multiple tags', () => {
        let tree = initTagTree();
        tree = insertTag(tree, '#tag1', noteId2);
        tree = insertTag(tree, '#tag1/tag2', noteId1);
        expect(tree.root.children[0].children[0]).toEqual({ name: 'tag2', noteIds: [noteId1], children: [] });
    });

    test('insertTag should prevent inserting the same noteId to the same node twice', () => {
        let tree = initTagTree();
        tree = insertTag(tree, '#tag1', noteId1);
        tree = insertTag(tree, '#tag1', noteId1);
        expect(tree.root.children[0].noteIds.length).toBe(1);
    });

    test('insertTag should add a tag to the tree under the correct parent', () => {
        let tree = initTagTree();
        tree = insertTag(tree, '#tag1/tag2', noteId1);
        expect(tree.root.children[0].children[0]).toEqual({ name: 'tag2', noteIds: [noteId1], children: [] });
    });

    test('deleteTag should remove a noteId from a tag', () => {
        let tree = initTagTree();
        tree = insertTag(tree, '#tag1', noteId1);
        tree = deleteTag(tree, '#tag1', noteId1);
        expect(tree.root.children.length).toBe(0);
    });

    test('deleteTag should not remove a noteId if the tag does not exist', () => {
        let tree = initTagTree();
        tree = insertTag(tree, '#tag1', noteId1);
        tree = deleteTag(tree, '#tag2', noteId1);
        expect(tree.root.children[0].noteIds.length).toBe(1);
    });
});