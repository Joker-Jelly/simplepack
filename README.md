# simplepack
> Make pack more simple than ever, base on **Webpack (version 3+)**

Webpack is a good tool, but the complex config file make me confuse when be a beginner.

`simplepack` want to let you drop the complex config file, use single line command(or minimal config file) to finish the job.

- Use out of box, many useful loaders and plugins builtin
- Extend webpack config ability
- Made for global use, so just install once for all



## Ability

![](https://img.alicdn.com/tfs/TB1ViOhigMPMeJjy1XdXXasrXXa-1425-723.gif)

`simplepack` have lots of loaders and plugins builtin, you can build these extensions directly

- React: `.jsx`
- Vue: `.vue` (with ES6+ support)
- Javascript: `.js` (with ES6+ support)
- Styles: `.less` or `.css` (extract css to single file)
- JSON: `.json`
- Text: `.txt`



## Install
```shell
# global install
npm install -g simplepack

# or you need to admin auth.
sudo npm install -g simplepack
```

## API

### Commands

```shell
# dev: start a dev server, build and serve file in memory
simplepack dev --entry ./index.js

# publush: build and export file to ./dist folder
simplepack publish --entry ./index.js
```


###Options 

Both dev and publish command has the **same options**

```shell
 ╭∩╮（︶︿︶）╭∩╮: simplepack -h
[Simplepack]:  Start parse config file...

  Usage: simplepack [options] [command]

  Commands:

    dev, d      Start dev server for develop
    help        Display help
    publish, p  get dist. file for publish

  Options:

    -C, --cli-only        Use CLI config only, not merge config file (disabled by default)
    -c, --compress        Whether compress the output code
    -E, --engine [value]  The name of workflow engine (defaults to "webpack")
    -e, --entry           The list entries
    -E, --export          The name of Component export
    -h, --help            Output usage information
    -v, --version         Output the version number
```



|          | Description                              | Type            | Default |
| :------- | :--------------------------------------- | :-------------- | :------ |
| entry    | The list entries                         | String / Object | null    |
| compress | Whether uglify the output code           | Boolean         | false   |
| export   | The name of Component export             | String          | null    |
| cli-only | Use CLI config only, not merge config file | Boolean         | false   |

#### option.entry

Most like **Webpack config [`option.entry`](https://webpack.js.org/configuration/entry-context/#entry)** , but extend the **glob** ablity

```javascript
{
  // simple
  // './test/a.js' => './dist/test/a.js'
  entry: './test/a.js'
  
  // simple with glob: expand to multi entry
  // './test/(a,b,c...).js' => './dist/test/(a,b,c...).js'
  entry: './test/*.js'
  
  // complex
  entry: {
    // './test/a.js' => './dist/a-new.js'
    'a-new': './test/a.js',
    
    // special @multi key, same as `simple with glob`
    '@multi': './test/*.js',     
    
    // special @vendor key, specific the third party lib.
    // vendor will pack to a single file, instead of pack into other bundle
    // jquery+loadsh => './dist/vendor.js'
    '@vendor': [
      'jquery',
      'lodash'
    ]
  }
}
```

Other notice: 

- Complex entry support `array` in object value, it indicate you want multi file to build in one entry


- `vendor.js` need to manualy import to your project, use `<script>` tag, [more detail](https://webpack.js.org/plugins/commons-chunk-plugin/#explicit-vendor-chunk)



## Usage

After install you can pack in any project, just need single line command.



### CLI only

```shell
simplepack dev --entry './index.js' --compress --export 'AComponent'
```




### With Config File

Put a js file to your project root, named `simplepack.config.js`
```javascript
{
  entry: {
    index: './index.js'
  },
  compress: true,
  export: 'AComponent'
}
```



## Runtime detail

```javascript
{
  core: {
    "webpack": "3.6.0",
    "webpack-dev-server": "2.8.2"
  },
  loader: {
    "js": {
      "babel": {
	    "babel-core": "^6.26.0",
	    "babel-loader": "^7.1.2",
        "babel-preset-env": "^1.6.0",
        "babel-preset-react": "^6.24.1"
      }
    },
    "css": {
      "css-loader": "^0.28.7",
      "less-loader": "^2.2.3",
      "style-loader": "^0.13.1",
      "extract-text-webpack-plugin": "^3.0.0"
    },
    "other": {
      "file-loader": "^0.11.2",
      "expose-loader": "^0.7.3",
      "html-loader": "^0.5.1",
      "json-loader": "^0.5.7",
      "raw-loader": "^0.5.1",
      "url-loader": "^0.5.9"
    },
    "vue": {
      "vue-loader": "^13.0.4",
	  "vue-template-compiler": "^2.4.4"
    }
  }
}
```

## License
MIT