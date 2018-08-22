module.exports = {
	/*------------------------------------------------------------*/
  /* basic */
	engine: 'webpack',
	entry: {
		'./index': './index'
	},

	/*------------------------------------------------------------*/
	/* common */
	port: 8080,
  notClear: false,
  notCompress: false,
  export: '',
	extractCss: false,
	buildExclude: null,

  /*------------------------------------------------------------*/
  /* webpack & babel */
	webpack: {
		moduleAlias: {
			'react': 'preact-compat',
	    'react-dom': 'preact-compat',
	    'create-react-class': 'preact-compat/lib/create-react-class'
		},
		moduleExternals: ['preact', 'preact-compat'],
		extraLoaders: [
			{
	      test: /\.html$/,
	      exclude: REG_EXCLUDE_PATH,
	      use: [
	        'html-loader'
	      ]
	    }
		],
		extraPlugins: [
			new webpack.optimize.UglifyJsPlugin({
	      compress: {
	          warnings: false
	      }
	    })
		]
	},
	babel: {
		babelrc: false,
		jsx: {
			pragma: 'preact.h'
		}
	}
}