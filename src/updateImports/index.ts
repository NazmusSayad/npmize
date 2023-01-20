

import fs from 'fs'
import * as babel from '@babel/parser'
import * as node from './node.js'
import * as utils from './utils.js'



const getImports = (parsed) => {
    return [
        ...node.CallExpressionImport(parsed),
        ...node.TSImportType(parsed),
        ...node.ImportDeclaration_ExportNamedDeclaration_ExportAllDeclaration(parsed),
    ];
};
const getRequires = (parsed) => {
    return node.CallExpressionRequire(parsed);
};



export default  (type, files) => {
    files.forEach((filePath) => {
        const fileData = fs.default.readFileSync(filePath, 'utf-8');
        const parsedBody = babel.parse(fileData, {
            sourceType: 'module',
            plugins: ['typescript'],
            sourceFilename: filePath,
        }).program.body;
        const found = (filePath.endsWith('.ts') || type === 'mjs' ? getImports : getRequires)(parsedBody);
        const dataParts = (0, utils.getUpdatedData)(fileData, found, (node) => {
            const ext = `.${type[0]}js`;
            const jsRegex = /\.js$/gim;
            return jsRegex.test(node.value)
                ? node.value.replace(jsRegex, ext)
                : node.value + ext;
        });
        const newFilePath = filePath.replace(/\.(js|ts)$/, (match) => {
            return match.replace(/js|ts/, (m) => type[0] + m);
        });
        fs.default.rmSync(filePath);
        fs.default.writeFileSync(newFilePath, dataParts);
    });
};
