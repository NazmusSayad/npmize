 
export const getUpdatedData = (fileData, found, cb) => {
    const newEntries = [
        { start: 0, end: 0, value: '', rawValue: '', filename: '' },
        ...found.sort((a, b) => a.start - b.start),
    ];
    const chunks = newEntries.map((node, i, arr) => {
        let _a;
        const nextNode = arr[i + 1];
        const nodeEnd = node.end;
        const nextNodeEnd = nextNode ? nextNode.start : Infinity;
        const str = fileData.slice(nodeEnd, nextNodeEnd);
        if (!nextNode)
            return str;
        return [str, `"${(_a = cb(nextNode)) !== null && _a !== void 0 ? _a : nextNode.value}"`];
    });
    return chunks.flat().join('');
};
 


export const isOkString = (a) => {
    return a && a.type === 'StringLiteral' && a.value.startsWith('.');
};
 


export const parseString = (str) => ({
    start: str.start,
    end: str.end,
    value: str.value,
    rawValue: str.extra.raw,
    filename: str.loc.filename,
});
 


