// tag.test.ts
import { extractTags, modifyTags, tagToHtml, hierarchyToDbRecords, dbRecordsToHierarchy, tagStringToHierarchy, mergeTags } from '../src/shared/utils/tag';
import { Tag, UserId, NoteId } from '../src/shared/types';
import { Database } from '../src/shared/db.types'
import { Children } from 'react';
import { idea } from 'react-syntax-highlighter/dist/esm/styles/hljs';



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

    describe('hierarchyToDbRecords', () => {
        it('should convert tag hierarchy to flat database structure', () => {
            const tag = {
                id: 'uuid1',
                name: 'tag1',
                children: [
                    { id: 'uuid2', name: 'tag2' },
                    { id: 'uuid3', name: 'tag3' }
                ]
            };
            const userId = '1';
            const noteId = 'note1';

            const expected = [
                { id: 'uuid1', name: 'tag1', note_id: noteId, parent: null, user_id: userId },
                { id: 'uuid2', name: 'tag2', note_id: noteId, parent: 'uuid1', user_id: userId },
                { id: 'uuid3', name: 'tag3', note_id: noteId, parent: 'uuid1', user_id: userId }
            ];

            const result = hierarchyToDbRecords(tag, userId, noteId);
            console.log(result)
            expect(result).toEqual(expected);
        });

        it('should convert deep tag hierarchy to flat database structure', () => {
            const tag = {
                id: 'uuid1',
                name: 'tag1',
                children: [
                    {
                        id: 'uuid2',
                        name: 'tag2',
                        children: [
                            { id: 'uuid4', name: 'tag4' },
                            {
                                id: 'uuid5', name: 'tag5',
                                children: [
                                    { id: 'uuid6', name: 'tag6' }
                                ]
                            }
                        ]
                    },
                    { id: 'uuid3', name: 'tag3' }
                ]
            };
            const userId = '1';
            const noteId = 'note1';

            const expected = [
                { id: 'uuid1', name: 'tag1', note_id: noteId, parent: null, user_id: userId },
                { id: 'uuid2', name: 'tag2', note_id: noteId, parent: 'uuid1', user_id: userId },
                { id: 'uuid4', name: 'tag4', note_id: noteId, parent: 'uuid2', user_id: userId },
                { id: 'uuid5', name: 'tag5', note_id: noteId, parent: 'uuid2', user_id: userId },
                { id: 'uuid6', name: 'tag6', note_id: noteId, parent: 'uuid5', user_id: userId },
                { id: 'uuid3', name: 'tag3', note_id: noteId, parent: 'uuid1', user_id: userId }
            ];

            const result = hierarchyToDbRecords(tag, userId, noteId);
            console.log(result)
            expect(result).toEqual(expected);
        });
    });


    describe('dbRecordsToHierarchy', () => {
        it('should convert flat database structure to tag hierarchy', () => {
            const records: Database['public']['Tables']['tags']['Row'][] = [
                { id: 'uuid1', name: 'tag1', note_id: 'note1', parent: null, user_id: '1', created_at: '2022-01-01T00:00:00Z', updated_at: '2022-01-01T00:00:00Z' },
                { id: 'uuid2', name: 'tag2', note_id: 'note1', parent: 'uuid1', user_id: '1', created_at: '2022-01-01T00:00:00Z', updated_at: '2022-01-01T00:00:00Z' },
                { id: 'uuid3', name: 'tag3', note_id: 'note1', parent: 'uuid1', user_id: '1', created_at: '2022-01-01T00:00:00Z', updated_at: '2022-01-01T00:00:00Z' }
            ];

            const expected = [{
                id: 'uuid1',
                name: 'tag1',
                children: [
                    { id: 'uuid2', name: 'tag2' },
                    { id: 'uuid3', name: 'tag3' }
                ]
            }];

            const result = dbRecordsToHierarchy(records);

            expect(result).toEqual(expected);
        });

        it('should convert deeper flat database structure to tag hierarchy', () => {
            const records: Database['public']['Tables']['tags']['Row'][] = [
                { id: 'uuid1', name: 'tag1', note_id: 'note1', parent: null, user_id: '1', created_at: '2022-01-01T00:00:00Z', updated_at: '2022-01-01T00:00:00Z' },
                { id: 'uuid2', name: 'tag2', note_id: 'note1', parent: 'uuid1', user_id: '1', created_at: '2022-01-01T00:00:00Z', updated_at: '2022-01-01T00:00:00Z' },
                { id: 'uuid3', name: 'tag3', note_id: 'note1', parent: 'uuid2', user_id: '1', created_at: '2022-01-01T00:00:00Z', updated_at: '2022-01-01T00:00:00Z' },
                { id: 'uuid4', name: 'tag4', note_id: 'note1', parent: 'uuid3', user_id: '1', created_at: '2022-01-01T00:00:00Z', updated_at: '2022-01-01T00:00:00Z' },
                { id: 'uuid5', name: 'tag5', note_id: 'note1', parent: 'uuid4', user_id: '1', created_at: '2022-01-01T00:00:00Z', updated_at: '2022-01-01T00:00:00Z' },
            ];

            const expected = [{
                id: 'uuid1',
                name: 'tag1',
                children: [
                    {
                        id: 'uuid2',
                        name: 'tag2',
                        children: [
                            {
                                id: 'uuid3',
                                name: 'tag3',
                                children: [
                                    {
                                        id: 'uuid4', name: 'tag4',
                                        children: [
                                            { id: 'uuid5', name: 'tag5' }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }];

            const result = dbRecordsToHierarchy(records);

            expect(result).toEqual(expected);
        });
    });

    describe('tagStringToHierarchy', () => {
        it('should convert tag string to hierarchy', () => {
            const tagString = 'tag1/tag2/tag3';
            const result = tagStringToHierarchy(tagString);
            const expected = {
                id: expect.stringMatching(/^temp-/),
                name: 'tag1',
                children: [{
                    id: expect.stringMatching(/^temp-/),
                    name: 'tag2',
                    children: [{
                        id: expect.stringMatching(/^temp-/),
                        name: 'tag3',
                        children: []
                    }]
                }]
            };
            expect(result).toEqual(expected);
        });
    });

    describe('mergeTags', () => {
        it('should merge source tags into target tags', () => {
            const target: Tag[] = [{
                id: 'uuid1',
                name: 'tag1',
                children: []
            }];

            const source: Tag[] = [{
                id: 'uuid2',
                name: 'tag2',
                children: []
            }];

            const result = mergeTags(target, source);
            const expected: Tag[] = [
                {
                    id: 'uuid1',
                    name: 'tag1',
                    children: []
                },
                {
                    id: 'uuid2',
                    name: 'tag2',
                    children: []
                }
            ];
            expect(result).toEqual(expected);
        });

        it('should merge children of source tags into target tags', () => {
            const target: Tag[] = [{
                id: 'uuid1',
                name: 'tag1',
                children: [{
                    id: 'uuid2',
                    name: 'tag2',
                    children: []
                }]
            }];

            const source: Tag[] = [{
                id: 'uuid1',
                name: 'tag1',
                children: [{
                    id: 'uuid3',
                    name: 'tag3',
                    children: []
                }]
            }];

            const result = mergeTags(target, source);
            const expected: Tag[] = [{
                id: 'uuid1',
                name: 'tag1',
                children: [
                    {
                        id: 'uuid2',
                        name: 'tag2',
                        children: []
                    },
                    {
                        id: 'uuid3',
                        name: 'tag3',
                        children: []
                    }
                ]
            }];
            expect(result).toEqual(expected);
        });
    });
});