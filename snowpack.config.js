module.exports = {
    mount: {
        public: {url: "/", static: true},
        src: {url: "/dist"}
    },
    buildOptions: {
        out: "build",
        clean: true,
        baseUrl: "/ai-maturity-model/"
    },
    routes: [
        {
            match: "routes",
            src: ".*",
            dest: "/index.html"
        }
    ],
    optimize: {
        bundle: true,
        minify: true,
        treeshake: true,
        target: "es2020"
    },
    exclude: [
        "scripts/**/*",
        "generate-blueprint.js"
    ],
    packageOptions: {
        polyfillNode: true,
        external: ["fs", "path", "crypto"],
        source: "local",
        rollup: {
            plugins: [
                {
                    name: 'node-resolve',
                    resolveId(id) {
                        if (id === 'lit' || id === 'lit-html' || id === 'lit-element') {
                            return id;
                        }
                        return null;
                    },
                    load(id) {
                        if (id === 'lit' || id === 'lit-html' || id === 'lit-element') {
                            return 'export default {};';
                        }
                        return null;
                    }
                }
            ]
        }
    }
}; 