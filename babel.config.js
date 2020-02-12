module.exports = function(api) {
    api.cache(true);

    const presets = [
        '@babel/typescript',
        [
            '@babel/preset-env',
            {
                targets: {
                    ie: 11,
                    browsers: 'last 2 versions',
                },
            },
        ],
    ];
    const plugins = [
        '@babel/proposal-class-properties',
        '@babel/proposal-object-rest-spread',
    ];

    return {
        presets,
        plugins
    }
}
