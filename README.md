# node-ez

This package tries to help you to make npm package without thinking about cjs and mjs module.

## Features

- Zero Config.
- Very very simple.
- Very very lightweight.
- This supports `typescript`.
- Source code can be writted in `cjs` or `mjs`(esmodule)
- Compiles into only `cjs` in dev mode and both `cjs` and `mjs`(esmodule) in build mode.
- Enables `__dirname` and `__filename` for `mjs`(esmodule).

<a href="https://npmjs.com/package/npm-ez">
  <img src="https://img.shields.io/npm/v/npm-ez" alt="npm package"> 
</a>

---

## Installation

- with npm (globally)

```shell
npm i -g npm-ez
```

- with npm

```shell
npm i -D npm-ez
```

- with yarn

```shell
yarn add -D npm-ez
```

- with pnpm

```shell
pnpm add -D npm-ez
```

<br/>

---

<br/>

# Command Line Interface

The interface for command-line usage is fairly simplistic at this stage, as seen in the following usage section.

## Usage

```shell
npm-ez <command> [options]
```

### Example:

```shell
npm-ez dev
```

_This starts typescript watch mode._

<br/>

---

<br/>

## Commands

| Command | Description                   |
| ------- | ----------------------------- |
| init    | Initilize `package.json`      |
| dev     | Start `typescript` watch mode |
| build   | Build for prod                |

<br/>

## Command Options

| Option       | Description                                                   |
| ------------ | ------------------------------------------------------------- |
| --node       | This enables `__dirname` and `__filename` in esmodule         |
| --no-install | Not to install required dependencies automatically            |
| --no-ignore  | Not to add recommended ignore files to gitignore \| npmignore |
| --no-src     | Not to create src/index.ts folder when not exists             |

### Command: `init`

| Option     | Description                                                           |
| ---------- | --------------------------------------------------------------------- |
| --bin      | Also add `bin` field                                                  |
| --bin-mode | Use `bin` files for `main` and `types` and do not add `exports` field |

<br/>

---

<br/>

## **Note:**

- Do not use `VGhpcyBuYW1lIGlzIGFscmVhZHkgdXNlZCB0byBlbmFibGUgX19kaXJuYW1lIGFuZCBfX2ZpbGVuYW1lIDop` as a variable name in your top level code.

  - If you want to know why! [`Base64`](https://www.base64decode.org) ... Hope you know.

- If you don't star our github repo your wife will divorce you, Else if you don't have wife then you will never get her.

- This only takes your `compilerOptions` form `tscofnig.json` not the entire `tsconfig.json` file.

<br/>

---

Made by [Nazmus Sayad](https://github.com/NazmusSayad) with ❤️.
