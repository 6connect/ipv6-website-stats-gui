module.exports = {
  entry: __dirname+'/src/js/main.js',
  output: {
    path: __dirname+'/dist',
    filename: 'bundle.js'
  },
	mode: slsw.lib.webpack.isLocal ? "development": "production",
	optimization: {
		// We no not want to minimize our code.
		minimize: false
	},
};