# npmize

This package simplifies creating npm packages that work seamlessly across browsers and Node.js environments by handling CommonJS (CJS) and ES modules (ESM) for you.

# Features

- **TypeScript Support:** Compile TypeScript code with ease.
- **Zero Configuration:** Get started without any complex setup.
- **Universal Compatibility:** Works across browsers and Node.js.
- **ESM and CJS Compilation:** Compiles code to both CJS and ESM formats.
- **Simple and Lightweight:** Easy to use and maintains a small footprint.
- **Multiple Threads** Can utilize multiple threads for extremely large projects.
- **Path Conversion:** Converts TypeScript config paths to relative paths for compatibility.
- **ESM `__dirname` and `__filename` Support:** Enables these variables for ESM compatibility.

# Installation

**Locally:**

```bash
npm install -D npmize
```

**Yarn:**

```bash
yarn add -D npmize
```

**pnpm:**

```bash
pnpm add -D npmize
```

# Usage

```bash
npmize <command> [options]
```

**Example:**

1. Initialize a new project:

   ```bash
   npmize init project-name
   ```

2. Get help information:

   ```bash
   npmize --help
   npmize --help-usage
   ```

<br />

## TypeScript Path Handling:

If you use TypeScript paths, ensure `baseUrl` is set in your `tsconfig.json`. For files within a `src` directory, set `baseUrl` to `./src`.

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "outDir": "./dist",
    "paths": { "@/*": ["./*"] }
  },
  "include": ["./src"]
}
```

# Notes

- **Variable Naming:** Avoid using `VGhpcyBuYW1lIGlzIGFscmVhZHkgdXNlZCB0byBlbmFibGUgX19kaXJuYW1lIGFuZCBfX2ZpbGVuYW1lIDop` (encoded using Base64) as a top-level variable name.

<br />
<br />

Made with ❤️ by [Nazmus Sayad](https://github.com/NazmusSayad).
