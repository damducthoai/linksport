module.exports = {
    entry: {
        server: './lib/index.js',
    },
    output: {
      filename: './backend_listener.js'
    },
    target: 'node',
    mode: 'production'
  }