module.exports = {
	distDirName: 'dist',
	distPublicPath: 'https://g.alicdn.com/dist/',
	entry: './index.js',
  moduleAlias: {
  	'index2': './index.less'
  },
  babel: {
		jsx: {
			pragma: 'Dinamic.h'
		}
	}
}