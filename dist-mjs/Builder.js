import{fileURLToPath as ______fIlE___UrL___tO___pATh______}from'url';let __filename=______fIlE___UrL___tO___pATh______(import.meta.url);let __dirname=______fIlE___UrL___tO___pATh______(new URL('.',import.meta.url));
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Builder_instances, _Builder_libDir, _Builder_runCmd, _Builder_createTSConfig, _Builder_cleanDir, _Builder_addPackageData, _Builder_prependNodeCode, _Builder___nodeCode;
import fs from 'fs';
import path from 'path';
import shell from 'shelljs';
import lsFiles from 'node-ls-files';
class Builder {
    constructor() {
        _Builder_instances.add(this);
        _Builder_libDir.set(this, path.join(__dirname, '../lib'));
        _Builder___nodeCode.set(this, `import{fileURLToPath as ______fIlE___UrL___tO___pATh______}from'url';let __filename=______fIlE___UrL___tO___pATh______(import.meta.url);let __dirname=______fIlE___UrL___tO___pATh______(new URL('.',import.meta.url));\n`);
    }
    dev() {
        __classPrivateFieldGet(this, _Builder_instances, "m", _Builder_runCmd).call(this, 'cjs', {
            watch: true,
        });
    }
    build() {
        __classPrivateFieldGet(this, _Builder_instances, "m", _Builder_runCmd).call(this, 'cjs');
        const outputDir = __classPrivateFieldGet(this, _Builder_instances, "m", _Builder_runCmd).call(this, 'mjs');
        const files = lsFiles.sync(outputDir, {
            filter: /\.m?js$/,
        });
        files.forEach((file) => __classPrivateFieldGet(this, _Builder_instances, "m", _Builder_prependNodeCode).call(this, file));
    }
}
_Builder_libDir = new WeakMap(), _Builder___nodeCode = new WeakMap(), _Builder_instances = new WeakSet(), _Builder_runCmd = function _Builder_runCmd(type, { watch = false } = {}) {
    const outputDir = path.resolve(`./dist-${type}`);
    __classPrivateFieldGet(this, _Builder_instances, "m", _Builder_cleanDir).call(this, outputDir);
    __classPrivateFieldGet(this, _Builder_instances, "m", _Builder_addPackageData).call(this, outputDir, type);
    const projectPath = __classPrivateFieldGet(this, _Builder_instances, "m", _Builder_createTSConfig).call(this, type);
    const cmdStr = `tsc -p ${projectPath} --rootDir src --baseUrl src --outDir dist-${type}${watch ? ' -w' : ''}`;
    shell.exec(cmdStr, { async: watch });
    return outputDir;
}, _Builder_createTSConfig = function _Builder_createTSConfig(type) {
    const fileName = `./tsconfig-${type}.json`;
    const userTsconfPath = path.resolve(fileName);
    let userMjsTsConf = {};
    if (fs.existsSync(userTsconfPath)) {
        try {
            userMjsTsConf = JSON.parse(fs.readFileSync(userTsconfPath, 'utf-8'));
        }
        catch (_a) { }
    }
    if (!userMjsTsConf.include)
        userMjsTsConf.include = ['src'];
    else if (!userMjsTsConf.include.includes('src')) {
        userMjsTsConf.include.unshift('src');
    }
    userMjsTsConf.extends = path.join(__classPrivateFieldGet(this, _Builder_libDir, "f"), fileName);
    fs.writeFileSync(userTsconfPath, JSON.stringify(userMjsTsConf, null, '\t'));
    return fileName;
}, _Builder_cleanDir = function _Builder_cleanDir(dir) {
    if (!fs.existsSync(dir))
        return;
    const list = fs.readdirSync(dir);
    list.forEach((item) => {
        fs.rmSync(path.join(dir, item), {
            recursive: true,
            force: true,
        });
    });
}, _Builder_addPackageData = function _Builder_addPackageData(dir, type) {
    const content = {
        type,
    };
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    const target = path.join(dir, './package.json');
    fs.writeFileSync(target, JSON.stringify(content));
}, _Builder_prependNodeCode = function _Builder_prependNodeCode(file) {
    const data = fs.readFileSync(file, 'utf-8');
    if (data.includes('__filename') || data.includes('__dirname')) {
        fs.writeFileSync(file, __classPrivateFieldGet(this, _Builder___nodeCode, "f") + data);
    }
};
export default Builder;
