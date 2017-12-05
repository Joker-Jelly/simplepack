module.exports = {
	/*------------------------------------------------------------*/
  /* basic */
	engine: 'webpack',
	entry: {
		'./demo/index': './demo/index'
	},

	/*------------------------------------------------------------*/
  /* common */
  compress: false,
  export: '',
  extractCss: false,

  /*------------------------------------------------------------*/
  /* webpack & babel */
	moduleAlias: {
		'react': 'preact-compat',
    'react-dom': 'preact-compat',
    'create-react-class': 'preact-compat/lib/create-react-class'
	},
	babel: {
		jsx: {
			pragma: 'preact.h'
		}
	}
}