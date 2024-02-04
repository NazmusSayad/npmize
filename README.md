# npmize

This package tries to help you to make npm package without thinking about cjs and mjs module.

## Features

- Zero Config.
- Very very simple.
- Very very lightweight.
- This supports `typescript`.
- Enables `__dirname` and `__filename` for `mjs`(EsModule).

<a href="https://npmjs.com/package/npmize">
  <img src="https://img.shields.io/npm/v/npmize" alt="npm package"> 
</a>

---

## Installation

- with npm (globally)

```shell
npm i -g npmize
```

- with npm

```shell
npm i -D npmize
```

- with yarn

```shell
yarn add -D npmize
```

- with pnpm

```shell
pnpm add -D npmize
```

<br/>

---

<br/>

# Command Line Interface

The interface for command-line usage is fairly simplistic at this stage, as seen in the following usage section.

## Usage

```shell
npmize <command> [options]
```

### Example:

```shell
npmize dev
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

| Option       | Description                                                     |
| ------------ | --------------------------------------------------------------- |
| --no-install | Not to install required dependencies automatically              |
| --no-ignore  | Not to add recommended ignore files to .gitignore \| .npmignore |
| --no-src     | Not to create src/index.ts folder when not exists               |

### Command: `init`

| Option   | Description           |
| -------- | --------------------- |
| --bin    | Also add `bin` field  |
| --legacy | Uses `.js` for fields |

### Command: `dev` & `build`

You can use almost any typescript cli command here by using `--tsc`.
eg: `--tsc--jsx=react` --> `--jsx react`

Not allowed list: `--project` `--outDir` `--module` `--watch` and their aliases

| Option       | Description                             |
| ------------ | --------------------------------------- |
| --module=cjs | This starts dev mode of commonjs module |
| --module=mjs | This starts dev mode of esmodule module |

<br/>

### Command: `build`

| Option   | Description                                           |
| -------- | ----------------------------------------------------- |
| --node   | This enables `__dirname` and `__filename` in esmodule |
| --legacy | Uses `.js` files and creates package.json with type   |

<br/>

---

<br/>

## **Note:**

- You should use --module=cjs with dev mode when working with packages for node because `__dirname` and `__filename` isn't supported in esmodule in dev mode
- Do not use `VGhpcyBuYW1lIGlzIGFscmVhZHkgdXNlZCB0byBlbmFibGUgX19kaXJuYW1lIGFuZCBfX2ZpbGVuYW1lIDop` as a variable name in your top level code.

  - If you want to know why! [`Base64`](https://www.base64decode.org) ... Hope you know.

- If you don't star our github repo your wife will divorce you, Else if you don't have wife then you will never get her.

<br/>

---

Made by [Nazmus Sayad](https://github.com/NazmusSayad) with ❤️.
