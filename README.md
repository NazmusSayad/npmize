# node-ez

Let's create an npm package without worring about anything.

## Features

- Uses `typescript`.
- Compiles into only `cjs` in dev mode and both `cjs` and `mjs`(esmodule) in build mode.
- Enables `__dirname` and `__filename` for `mjs`(esmodule).

<a href="https://npmjs.com/package/npm-ez">
  <img src="https://img.shields.io/npm/v/npm-ez" alt="npm package"> 
</a>

## Installation

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

## Command Line Interface

The interface for command-line usage is fairly simplistic at this stage, as seen in the following usage section.

## Usage

```shell
npm-ez <command> [options]
```

```sh
npx npm-ez <command> [options]
```

### Example:

```shell
npm-ez dev
```

```shell
npx npm-ez dev
```

_This starts typescript watch mode._

<br/>

## Commands

| Command      | Description |
| ------------ | ----------- |
| init         | Title       |
| build        | Title       |
| dev \| start | Text        |

<br/>

## Command Options

### Command: `init`

| Option | Description |
| ------ | ----------- |
| bin    | Title       |
| --bin  | Title       |

## `__dirname` & `__filename`

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
