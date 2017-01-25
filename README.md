# simplepack
Make pack simple then ever, base on **Webpack 2**

Webpack is a damned good tool, but it complex config file let me crazy when be a beginner.

So `simplepack` want to let you drop the complex config file, use single line command to finish the job.

- No need config file
- loaders builtin
- made for global use, so just install once for all

**This project is not yet finish, lots of feature still in development and thinking**

## Install
```shell
  # global install
  npm install -g simplepack
```

## Usage
After install you can pack in any project, just need single line command.

### CLI only
```shell

  # dev
  simplepack dev --entry.index ./index.js

  # publush
  simplepack publish --entry.index ./index.js

```

### With Config File

put a js file to your project root, named `simplepack.config.js`
```javascript
  {
    // same as webpack entry config ( string or object )
    entry: {
      index: [./index.js]
    },

    // whether compress js
    compress: false,

    // define the name when export the project as a component
    export: ''
  }
```

## Runtime

```javascript
{
  core:{
    "webpack": "^2.2.0",
    "webpack-dev-server": "^2.2.0",
  },
  loader: {
    "js": {
      "babel": {
        "babel-core": "^6.20.0",
        "babel-loader": "^6.2.9",
        "babel-preset-latest": "^6.16.0"
      }
    },
    "css": {
      "css-loader": "^0.26.1",
      "less-loader": "^2.2.3",
      "style-loader": "^0.13.1"
    }
  }
}
```

## License
MIT