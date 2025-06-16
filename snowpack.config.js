module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' }
  },
  buildOptions: {
    out: 'build',
    clean: true
  },
  routes: [
    { match: 'routes', src: '.*', dest: '/index.html' }
  ],
  alias: {
    fs: './empty.js'
  }
};
