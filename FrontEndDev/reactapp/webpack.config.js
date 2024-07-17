const path = require('path');
const glob = require('glob');
const webpack = require('webpack');

const componentsDir = path.resolve(__dirname, 'components');
const entries = {};

// Read all .js or .jsx files from the components directory
glob.sync(`${componentsDir}/**/*.{js,jsx}`).forEach((file) => {
    const relativePath = path.relative(__dirname, file);
    const componentName = path.basename(file, path.extname(file));
    entries[componentName] = `./${relativePath.replace(/\\/g, '/')}`;
});

module.exports = {
    mode: 'development',
    entry: entries,
    output: {
        path: path.resolve(__dirname, '../../wwwroot/js/compiledreact'),
        filename: '[name]Compiled.js', // will make the compiled version of the react components
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        fallback: {
            buffer: require.resolve('buffer/'),
        },
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },
};
