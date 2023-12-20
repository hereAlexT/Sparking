import { Database } from '../db.types'
import { Tag, UserId, NoteId } from '../types';
import { groupBy } from 'lodash';

const TAG_REGEX = /#[\w\/_\\\.]+/g;
const CODE_BLOCK_REGEX = /```[\s\S]*?```|`[\s\S]*?`/g;


const extractTags = (content: string): string[] => {
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


const modifyTags = (content: string, tag: string, newTag: string): string => {
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
const tagToHtml = (content: string, className: string): string => {

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


const dbRecordsToHierarchy = (records: Database['public']['Tables']['tags']['Row'][], parentId: string | null = null): Tag[] => {
    // Group the records by their parent ID
    const groups = groupBy(records, 'parent');

    // Get the records for the current parent ID
    const currentRecords = groups[parentId || 'null'] || [];

    // Convert each record to a tag and recursively build its children
    return currentRecords.map((record: Database['public']['Tables']['tags']['Row']) => {
        const children = dbRecordsToHierarchy(records, record.id);
        return {
            id: record.id,
            name: record.name,
            ...(children.length > 0 ? { children } : {})
        };
    });
}

const hierarchyToDbRecords = (tag: Tag, userId: UserId, noteId: NoteId, parent: string | null = null): Database['public']['Tables']['tags']['Insert'][] => {
    let rows: Database['public']['Tables']['tags']['Insert'][] = [];

    // Create a row for the current tag
    let row: Database['public']['Tables']['tags']['Insert'] = {
        id: tag.id,
        name: tag.name,
        note_id: noteId,
        parent: parent, // parent is passed as an argument
        user_id: userId
    };
    rows.push(row);

    // If the tag has children, recursively create rows for them
    if (tag.children) {
        for (let child of tag.children) {
            // Pass the current tag's id as the parent for the child
            rows = rows.concat(hierarchyToDbRecords(child, userId, noteId, tag.id));
        }
    }

    return rows;
}

/**
 * @param tagString  Tag string examples: 
 * `tag1/tag2`: tag2 is a child of tag1 -> {tag1: children: [tag2]}
 * `tag1`: tag1 is a root tag -> {tag1}
 * `tag1/tag2/tag3`: tag3 is a child of tag2, tag2 is a child of tag1 -> {tag1: children: [tag2: children: [tag3]]}
 */
const tagStringToHierarchy = (tagString: string): Tag => {
    const tagParts = tagString.split('/');
    let currentTag: Tag = { id: `temp-${Date.now()}`, name: tagParts.pop()!, children: [] };

    while (tagParts.length) {
        currentTag = { id: `temp-${Date.now()}`, name: tagParts.pop()!, children: [currentTag] };
    }

    return currentTag;
}

/**
 * Merge tagsA to tagsB, return the merged tags.
 * This function is used given tags A the note already has, and tags B the note needs to merge.
 * If TagsA
 * @param target Tags the note already has
 * @param source Tags the note needs to merge
 */
const mergeTags = (target: Tag[], source: Tag[]): Tag[] => {
    const targetMap = new Map(target.map(tag => [tag.name, tag]));

    source.forEach(tag => {
        if (!targetMap.has(tag.name)) {
            target.push(tag);
        } else {
            const targetTag = targetMap.get(tag.name)!;
            if (targetTag.children && tag.children) {
                targetTag.children = mergeTags(targetTag.children, tag.children);
            }
        }
    });

    return target;
}


/**
 * Extract tags from note content, merge them with existed tags, and return the merged tags.
 */
const noteToTags = (content: string, tags: Tag[]): Tag[] => {
    const newTags = extractTags(content).map(tag => tag.replace('#', '')).map(tagStringToHierarchy);
    return mergeTags(tags, newTags);
}

export {
    extractTags,
    modifyTags,
    tagToHtml,
    hierarchyToDbRecords,
    dbRecordsToHierarchy,
    tagStringToHierarchy,
    mergeTags,
    noteToTags
}