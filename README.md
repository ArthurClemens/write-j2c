# Write j2c to CSS


## Usage

```javascript
writeCSS(options)
```

## Example

```javascript
// styles.js
export default = [
  {
    '.red.strong': {
      color: '#f00',
      fontWeight: 'bold'
    }
  },
  {
    '.header': [
      {
        '&.h1': {
          'font-weight': 'bold'
        }
      },
      {
        '&.h1': {
          'color': '#000'
        }
      }
    ]
  },
];
```

```javascript
// postbuild.js
import { writeCSS } from "write-j2c"
import styles from "./styles"

writeCSS({
  styles,
  path: "./dist/app.css",
  beautify: true
})
```

Creates:

```css
.red.strong {
  color: red;
  font-weight: 700;
}

.header.h1 {
  font-weight: 700;
  color: #000;
}
```

## Options

| **Parameter**    |  **Required**  | **Type**             | **Default** | **Description** |
| ---------------- | -------------- | -------------------- | ----------- | --------------- |
| **styles**       | required       | Array of J2C styles  |             | See [j2c documentation](https://github.com/j2css/j2c) |
| **path**         | required       | String               |             | Where to save the output CSS file |
| **autoPrefix**   | optional       | Boolean              | false       | Set to `true` to add vendor prefixes; not needed if your bundler writes prefixes |
| **beautify**     | optional       | Boolean              | false       | Set to `true` to beautify the output (by default the output is minified) |
| **gzip**         | optional       | Boolean              | false       | Set to `true` to export a `.gz` file (next to the regular output file) |
| **wrapInGlobal** | optional       | Boolean              | false       | To use with CSS Modules: set to `true` to wrap the generated css inside a `:global { ... }` tag |
