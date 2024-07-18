const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: {
        //Manually add any components using this convention: 'component name': 'path to file',
        'file-upload': '/FrontEndDev/reactapp/components/file-upload.js'
    },
    output: {
        path: path.resolve(__dirname, '../../wwwroot/js/compiledreact/'),
        filename: '[name]-compiled.js', // will make the compiled version of the react components
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
        ],
    },
    resolve: {
        extensions: ['.js'],
        fallback: {
            buffer: require.resolve('buffer/'),
        }
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
