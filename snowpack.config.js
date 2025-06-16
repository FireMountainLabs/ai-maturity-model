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
  optimize: {
    bundle: true,
    minify: true,
    treeshake: true,
    target: 'es2020'
  },
  exclude: ['**/generate-blueprint.js'],
  packageOptions: {
    polyfillNode: true
  }
};
