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

console.log('Webpack Entries:', entries);

module.exports = {
    mode: 'development',
    entry: {
        //Manually add any components using this convention: 'component name': 'path to file',
        'file-upload': '/FrontEndDev/reactapp/components/file-upload.js',
        'login': '/FrontEndDev/reactapp/components/login.js'
    },
    output: {
        path: path.resolve(__dirname, '../../wwwroot/js/compiledreact/'),
        filename: '[name]Compiled.js', // will make the compiled version of the react components
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
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
