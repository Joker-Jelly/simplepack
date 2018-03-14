module.exports = {
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