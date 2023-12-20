// tag.test.ts
import { extractTags, modifyTags, tagToHtml } from '../src/shared/utils/tag';

describe('extractTags', () => {
    it('should extract tags from a markdown string', () => {
        const content = 'This is a test #tag';
        const expected = ['#tag'];
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
        console.log("result", result)
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