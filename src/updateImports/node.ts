

const utils_1 = require("../utils/utils");
const utils_2 = require("./utils");

export const TSImportType = (parsed) => {
    return (0, utils_1.findNestedItems)(parsed, 'type', 'TSImportType')
        .filter((node) => (0, utils_2.isOkString)(node.argument))
        .map((node) => (0, utils_2.parseString)(node.argument));
};


export const ImportDeclaration_ExportNamedDeclaration_ExportAllDeclaration = (parsed) => {
    return [
        (0, utils_1.findNestedItems)(parsed, 'type', 'ImportDeclaration'),
        (0, utils_1.findNestedItems)(parsed, 'type', 'ExportDeclaration'),
        (0, utils_1.findNestedItems)(parsed, 'type', 'ExportNamedDeclaration'),
        (0, utils_1.findNestedItems)(parsed, 'type', 'ExportAllDeclaration'),
    ]
        .flat()
        .filter((node) => (0, utils_2.isOkString)(node.source))
        .map((node) => (0, utils_2.parseString)(node.source));
};



export const CallExpressionImport = (parsed) => {
    return (0, utils_1.findNestedItems)(parsed, 'type', 'CallExpression')
        .filter((node) => { var _a; return ((_a = node.callee) === null || _a === void 0 ? void 0 : _a.type) === 'Import' && (0, utils_2.isOkString)(node.arguments[0]); })
        .map((node) => (0, utils_2.parseString)(node.arguments[0]));
};



export const CallExpressionRequire = (parsed) => {
    return (0, utils_1.findNestedItems)(parsed, 'type', 'CallExpression')
        .filter((node) => {
        var _a, _b;
        return node &&
            ((_a = node.callee) === null || _a === void 0 ? void 0 : _a.type) === 'Identifier' &&
            ((_b = node.callee) === null || _b === void 0 ? void 0 : _b.name) === 'require' &&
            (0, utils_2.isOkString)(node.arguments[0]);
    })
        .map((node) => (0, utils_2.parseString)(node.arguments[0]));
};


