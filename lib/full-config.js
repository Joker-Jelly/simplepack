module.exports = {
	/*------------------------------------------------------------*/
	/* basic */
	distDirName: './dist',
	distPublicPath: '/dist/',
	engine: 'webpack',
	entry: {
		'./index': './index'
	},

	/*------------------------------------------------------------*/
	/* common */

	prcessEnv: {
		IS_DEV: true
	},
	port: 8080,
  notClear: false,
  notCompress: false,
  export: '',
	extractCss: false,
	buildExclude: null,

	/*------------------------------------------------------------*/
	/* life-cycle */
	beforeConfigBind: firstArgs => firstArgs,
	
  /*------------------------------------------------------------*/
  /* webpack & babel */
	webpack: {
		showBundleAnalyzer: false,
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