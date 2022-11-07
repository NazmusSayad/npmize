"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Builder_js_1 = __importDefault(require("./Builder.js"));
const builder = new Builder_js_1.default();
switch (process.argv[2]) {
    case undefined:
    case 'dev':
        builder.dev();
        break;
    case 'build':
        builder.build();
        break;
}
