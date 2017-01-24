module.exports = [
  // js loaders
  [
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            'presets': [
              [require.resolve('babel-preset-latest'), { 'loose': true, 'modules': false }]
            ]
          }
        }
      ]
    }
  ],

  // css loaders
  [
    {
      test: /\.less$/,
      use: [
        'style-loader',
        'css-loader',
        'less-loader'
      ]
    },
    {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }
  ]
];