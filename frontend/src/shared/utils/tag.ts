//todo: extract tags from a string of markdown
//todo: modify tags from a string of markdown


const TAG_REGEX = /#[\w\.]+/g;
const CODE_BLOCK_REGEX = /```[\s\S]*?```/g;


const extract_tags = (content: string): string[] => {
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


const modify_tags = (content: string, tag: string, newTag: string): string => {
    const tagRegex = new RegExp(`#${tag}\\b`, 'g');
    const nonCodeBlockParts = content.split(CODE_BLOCK_REGEX);
    const modifiedParts = nonCodeBlockParts.map(part => part.replace(tagRegex, `#${newTag}`));
    return modifiedParts.join('');
}