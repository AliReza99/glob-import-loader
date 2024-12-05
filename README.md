
# @arbz/glob-import-loader

A Webpack loader that enables **glob imports** for your project. With this loader, you can easily import multiple files matching a glob pattern and get an array of objects containing the module and its relative path.

## Installation

```bash
npm install @arbz/glob-import-loader
```


or

```bash
yarn add @arbz/glob-import-loader
```

## Usage

Add the loader to your Webpack configuration:

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.glob-import-allowed\.(js|mjs|jsx|ts|tsx)?$/,
        loader: '@arbz/glob-import-loader',
        enforce: 'pre',
      },
    ],
  },
};
```

### Example

Given the following file structure:

```
src/
├── components/
│   ├── Header.jsx
│   ├── Footer.jsx
│   └── Sidebar.tsx
```

You can use the loader to import multiple files:

```javascript
import modules from './components/**/*.{jsx,tsx,ts}';

console.log(modules);
// Output:
// [
//   { module: Header, path: './Header.jsx' },
//   { module: Footer, path: './Footer.jsx' },
//   { module: Sidebar, path: './Sidebar.tsx' },
// ]
```

### Notes

- This loader supports only files with the `.glob-import-allowed` suffix by default (e.g., `index.glob-import-allowed.js`).
- The `path` property in the resulting array is the relative path from the glob import location.

## License

This project is licensed under the [MIT License](LICENSE).
