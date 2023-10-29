# rollup-plugin-html-location

Specify the output location of the html entry file.

## Installation

```shell
npm install rollup-plugin-html-location -D
```

## Usage

Assuming the project structure is as follows:

```
/
├─src
│  ├─demo
│  │  ├─demo1
│  │  │  └─index.html
│  │  └─demo2
│  │     └─index.html
│  └─main.js
├─package.json
├─rollup.config.js
└─...
```

### When without plugin

```javascript
// rollup.config.js
export default {
  input: {
    demo1: 'src/demo1/index.html',
    demo2: 'src/demo2/index.html',
    main: 'main.js',
  },
  output: {
    dir: 'dist',
    entryFileNames: '[name].js',
  },
};
```

**Output:**

```
├─dist
│  ├─src
│  │  ├─demo1
│  │  │  └─index.html
│  │  └─demo2
│  │     └─index.html
│  └─main.js
└─...
```

### With plugin

#### `dir` option

```javascript
// rollup.config.js
import HTMLLocation from 'rollup-plugin-html-location';

export default {
  input: {
    demo1: 'src/demo1/index.html',
    demo2: 'src/demo2/index.html',
    main: 'main.js',
  },
  output: {
    dir: 'dist',
    entryFileNames: '[name].js',
  },
  plugins: [
    HTMLLocation({
      dir: 'result',
    }),
  ],
};
```

**Output:**

```
├─dist
│  ├─result
│  │  └─src
│  │     ├─demo1
│  │     │  └─index.html
│  │     └─demo2
│  │        └─index.html
│  └─main.js
└─...
```

#### `filename` option

##### Use path key value pair

```javascript
// rollup.config.js
import HTMLLocation from 'rollup-plugin-html-location';

export default {
  input: {
    demo1: 'src/demo1/index.html',
    demo2: 'src/demo2/index.html',
    main: 'main.js',
  },
  output: {
    dir: 'dist',
    entryFileNames: '[name].js',
  },
  plugins: [
    HTMLLocation({
      filename: {
        'src/demo1/index.html': 'result/demo1.html'
        'src/demo2/index.html': 'result/demo2.html'
      }
    })
  ],
};
```

**Output:**

```
├─dist
│  ├─result
│  │  ├─demo1.html
│  │  └─demo2.html
│  └─main.js
└─...
```

##### Use function

```javascript
// rollup.config.js
import HTMLLocation from 'rollup-plugin-html-location';

export default {
  input: {
    demo1: 'src/demo1/index.html',
    demo2: 'src/demo2/index.html',
    main: 'main.js',
  },
  output: {
    dir: 'dist',
    entryFileNames: '[name].js',
  },
  plugins: [
    HTMLLocation({
      filename: input => input.replace('src/', ''),
    }),
  ],
};
```

**Output:**

```
├─dist
│  ├─demo1
│  │  └─index.html
│  ├─demo2
│  │  └─index.html
│  └─main.js
└─...
```

#### `disableClearEmptyFolder` option

```javascript
// rollup.config.js
import HTMLLocation from 'rollup-plugin-html-location';

export default {
  input: {
    demo1: 'src/demo1/index.html',
    demo2: 'src/demo2/index.html',
    main: 'main.js',
  },
  output: {
    dir: 'dist',
    entryFileNames: '[name].js',
  },
  plugins: [
    HTMLLocation({
      filename: {
        'src/demo1/index.html': 'demo1.html'
        'src/demo2/index.html': 'demo2.html'
      },
      disableClearEmptyFolder: true,
    }),
  ],
};
```

**Output:**

```
├─dist
│  ├─src
│  │  ├─demo1
│  │  └─demo2
│  ├─demo1.html
│  ├─demo2.html
│  └─main.js
└─...
```

#### `logging` option

```javascript
// rollup.config.js
import HTMLLocation from 'rollup-plugin-html-location';

export default {
  input: {
    demo1: 'src/demo1/index.html',
    demo2: 'src/demo2/index.html',
    main: 'main.js',
  },
  output: {
    dir: 'dist',
    entryFileNames: '[name].js',
  },
  plugins: [
    HTMLLocation({
      filename: {
        'src/demo1/index.html': 'demo1.html'
        'src/demo2/index.html': 'demo2.html'
      },
      logging: true,
    }),
  ],
};
```

Print operation log:

```shell
html-location:  [src/demo1/index.html] ==> [demo1.html]
html-location:  [src/demo2/index.html] ==> [demo2.html]
html-location:  clear empty folder!
```

## License

[MIT](./LICENSE)
