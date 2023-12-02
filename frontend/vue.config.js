module.exports = {
  pages: {
    'index': {
      entry: './src/pages/Home/main.js',
      template: 'public/index.html',
      title: 'Home',
      chunks: [ 'chunk-vendors', 'chunk-common', 'index' ]
    },
    'game': {
      entry: './src/pages/Game/main.js',
      template: 'public/index.html',
      title: 'Game',
      chunks: [ 'chunk-vendors', 'chunk-common', 'game' ]
    }
  }
}
