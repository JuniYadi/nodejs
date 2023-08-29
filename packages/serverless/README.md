# Random String

![npm](https://img.shields.io/npm/dm/@juniyadi/random-string)
![npm](https://img.shields.io/npm/v/@juniyadi/random-string)
![NPM](https://img.shields.io/npm/l/@juniyadi/random-string)
![npm bundle size](https://img.shields.io/bundlephobia/min/@juniyadi/random-string)

Generate Random Password with include Lowercase/Uppercase/Number or Symbol (Includes Ambiguous Character)

```javascript
import { generate } from "@juniyadi/random-string"; // ESM
// const { generate } = require("@juniyadi/random-string"); // CJS

const password = generate(16, {
  lowercase: 2,
  uppercase: 2,
  numbers: 2,
  symbols: 2,
});

console.log(password);
```
