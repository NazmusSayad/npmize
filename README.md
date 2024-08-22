# npmize

This package tries to help you to make npm package without thinking about cjs and mjs module.

## Features

- Zero Config.
- Very very simple.
- Very very lightweight.
- This supports `typescript`.
- **Compile** to `cjs` and `mjs` without any distraction.
- Enables `__dirname` and `__filename` for `mjs`(EsModule).
- Can work with **browser**, **node** everything related to JavaScript.

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

## How to use?

Add the help flag to see what **functionality** are available.

```shell
npmize --help
```

### Example:

```shell
npmize init project-name
npmize --help
npmize --help-usage
```

- _*This makes your project ready*_

<br/>

## **Note:**

- You should use --module=cjs with dev mode when working with packages for node because `__dirname` and `__filename` isn't supported in esmodule in dev mode
- Do not use `VGhpcyBuYW1lIGlzIGFscmVhZHkgdXNlZCB0byBlbmFibGUgX19kaXJuYW1lIGFuZCBfX2ZpbGVuYW1lIDop` as a variable name in your top level code.

  - If you want to know why! [`Base64`](https://www.base64decode.org) ... Hope you know.

- If you don't star our github repo your wife will divorce you, Else if you don't have wife then you will never get her.

<br/>

---

Made by [Nazmus Sayad](https://github.com/NazmusSayad) with ❤️.
