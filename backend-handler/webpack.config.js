module.exports = {
    entry: {
        server: './lib/index.js',
    },
    plugins: [
    ],
    output: {
      filename: './backend_handler.js'
    },
    target: 'node',
    mode: 'production',
    externals: {
    }
  }