module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' }
  },
  buildOptions: {
    out: 'build',
    clean: true,
    baseUrl: '/ai-maturity-model/'
  },
  routes: [
    { match: 'routes', src: '.*', dest: '/index.html' }
  ],
  alias: {
    fs: './empty.js'
  }
};
