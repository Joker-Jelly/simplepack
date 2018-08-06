module.exports = {
	/*------------------------------------------------------------*/
  /* basic */
	engine: 'webpack',
	entry: {
		'./demo/index': './demo/index'
	},

	/*------------------------------------------------------------*/
  /* common */
  notClear: false,
  notCompress: false,
  export: '',
	extractCss: false,
	excludeNodeModules: true,

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
		jsx: {
			pragma: 'preact.h'
		}
	}
}