// tag.test.ts
import {
    extractTags,
    modifyTags,
    tagToHtml,
    hierarchyToDbRecords,
    dbRecordsToHierarchy,
    tagStringToHierarchy,
    mergeTags,
    noteToTags
} from '../src/shared/utils/tagUtil';
import { Tag, UserId, NoteId } from '../src/shared/types';
import { Database } from '../src/shared/db.types'



describe('extractTags', () => {
    it('should extract tags from a markdown string', () => {
        const content = 'This is a test #tag';
        const expected = ['#tag'];
        const result = extractTags(content);
        expect(result).toEqual(expected);
    });

    it('should extract tags from a markdown string', () => {
        const content = 'This is a test #tag/tag2';
        const expected = ['#tag/tag2'];
        const result = extractTags(content);
        expect(result).toEqual(expected);
    });

    it('should not extract tags from codeblock', () => {
        const content = '```This is a test #tag```';
        const expected = [];
        const result = extractTags(content);
        expect(result).toEqual(expected);
    });
});

describe('modifyTags', () => {
    it('should modify tags', () => {
        const content = 'This is a test #tag';
        const expected = 'This is a test #newTag';
        const result = modifyTags(content, 'tag', 'newTag');
        expect(result).toEqual(expected);
    });

    it('should not modify tags from codeblock', () => {
        const content = '```This is a test #tag```';
        const expected = '```This is a test #tag```';
        const result = modifyTags(content, 'tag', 'newTag');
        expect(result).toEqual(expected);
    });
});

describe('tagToHtml', () => {
    it('should convert tags', () => {
        const content = 'This is a test #tag';
        const className = 'tag';
        const expected = 'This is a test <span class="tag">#tag</span>';
        const result = tagToHtml(content, className);
        expect(result).toEqual(expected);
    });

    it('should convert tag like #tag_2', () => {
        const content = '\#TagAtBeginning #TagInTheMiddle \#TagInMiddleWithSlash';
        const className = 'tag';
        const expected = '\<span class="tag">#TagAtBeginning</span> <span class="tag">#TagInTheMiddle</span> \<span class="tag">#TagInMiddleWithSlash</span>';
        const result = tagToHtml(content, className);
        expect(result).toEqual(expected);
    });

    it('should not convert tags in codeblock - code block with string', () => {
        const content = '```This is a test #tag```\ngreat day';
        const className = 'tag';
        const expected = '```This is a test #tag```\ngreat day';
        const result = tagToHtml(content, className);
        expect(result).toEqual(expected);
    });

    it('should not convert tags in codeblock - mutiple code block', () => {
        const content = '```This is a test #hello```\ngreat day```This is a test #tag```';
        const className = 'tag';
        const expected = '```This is a test #hello```\ngreat day```This is a test #tag```';
        const result = tagToHtml(content, className);
        expect(result).toEqual(expected);
    });

    it('should not convert tags in codeblock - single blocks', () => {
        const content = '```This is a test #tag```';
        const className = 'tag';
        const expected = '```This is a test #tag```';
        const result = tagToHtml(content, className);
        expect(result).toEqual(expected);
    });

});

describe('tagsDiff', () => {
    test('should return added tags', () => {
        const oldTags = ['tag1', 'tag2'];
        const newTags = ['tag1', 'tag2', 'tag3'];
        const diff = tagsDiff(oldTags, newTags);
        expect(diff.added).toEqual(['tag3']);
        expect(diff.removed).toEqual([]);
    });

    test('should return removed tags', () => {
        const oldTags = ['tag1', 'tag2', 'tag3'];
        const newTags = ['tag1', 'tag2'];
        const diff = tagsDiff(oldTags, newTags);
        expect(diff.added).toEqual([]);
        expect(diff.removed).toEqual(['tag3']);
    });

    test('should return added and removed tags', () => {
        const oldTags = ['tag1', 'tag2'];
        const newTags = ['tag2', 'tag3'];
        const diff = tagsDiff(oldTags, newTags);
        expect(diff.added).toEqual(['tag3']);
        expect(diff.removed).toEqual(['tag1']);
    });

    test('should return empty arrays if tags are the same', () => {
        const oldTags = ['tag1', 'tag2'];
        const newTags = ['tag1', 'tag2'];
        const diff = tagsDiff(oldTags, newTags);
        expect(diff.added).toEqual([]);
        expect(diff.removed).toEqual([]);
    });

    test('should handl nested tags', () => {
        const oldTags = ['tag1/tag2', 'tag2/tag4'];
        const newTags = ['tag1/tag2', 'tag1/tag4'];
        const diff = tagsDiff(oldTags, newTags);
        expect(diff.added).toEqual(['tag1/tag4']);
        expect(diff.removed).toEqual(['tag2/tag4']);
    });
});