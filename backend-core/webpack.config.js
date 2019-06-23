module.exports = {
    entry: {
        server: './lib/index.js',
    },
    output: {
      filename: './backend_core.js'
    },
    target: 'node',
    mode: 'production'
  }