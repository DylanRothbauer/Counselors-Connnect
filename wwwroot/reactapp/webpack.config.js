const path = require('path');

module.exports = {
    mode: 'development',
    entry: { //enter components here
       Example: './components/ExampleComponent.js',
        SecondExamole: './components/SecondExample.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
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
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },
};
