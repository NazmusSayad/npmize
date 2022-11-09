# node-ez

Let's create an npm package without worring about anything.

## Features

- Uses `typescript`.
- Very very lightweight.
- Compiles into only `cjs` in dev mode and both `cjs` and `mjs`(esmodule) in build mode.
- Enables `__dirname` and `__filename` for `mjs`(esmodule).

<a href="https://npmjs.com/package/npm-ez">
  <img src="https://img.shields.io/npm/v/npm-ez" alt="npm package"> 
</a>

<br/>

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
<br/>

# Command Line Interface

The interface for command-line usage is fairly simplistic at this stage, as seen in the following usage section.

## Usage

```shell
npm-ez <command> [options]
npx npm-ez <command> [options]
```

### Example:

```shell
npm-ez dev
npx npm-ez dev
```

_This starts typescript watch mode._

<br/>
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
| --no-install | Not to install required dependencies automatically            |
| --no-ignore  | Not to add recommended ignore files to gitignore \| npmignore |
| --no-src     | Not to create src/index.ts folder when not exists             |

### Command: `init`

| Option     | Description                                                           |
| ---------- | --------------------------------------------------------------------- |
| --bin      | Also add `bin` field                                                  |
| --bin-mode | Use `bin` files for `main` and `types` and do not add `exports` field |

<br/>
<br/>
<br/>

## About `__dirname` & `__filename`

To enable `__dirname` or `__filename` you need to add the following code at the top of each file you need to use it:

_Just like `'use strict'`_

```javascript
'use __dirname'

console.log(__dirname)
```

or

```javascript
'use __filename'

console.log(__filename)
```

or both

```javascript
'use __dirname'
'use __filename'

console.log(__dirname)
console.log(__filename)
```

**Warning:** If you place it like `('use __dirname')` or `['use __dirname']`, it will throw a syntax error.

<br/>
<br/>

## **Note:**

- If you don't star our github repo your wife will divorce you, Else if you don't have wife then you will never get her.
