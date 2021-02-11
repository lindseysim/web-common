const webpack  = require('webpack'), 
      path     = require('path'), 
      fs       = require('fs'), 
      CleanCSS = require('clean-css');

module.exports = {
    mode: 'production', 
    entry: {
        'common': './src/entry.js', 
        'CommonTable': './src/common.table.js'
    }, 
    output: {
        library: '[name]', 
        libraryTarget: 'umd', 
        libraryExport: 'default', 
        path: path.resolve(__dirname), 
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test:    /\.js$/,
                exclude: /(node_modules)/,
                loader:  'babel-loader', 
                query: {
                    presets: ['@babel/preset-env']
                }
            }
        ]
    }, 
    optimization: {
        concatenateModules: true, 
        minimize: true
    }, 
    plugins: [
        {
            apply: compiler => {
                new CleanCSS().minify(
                    ['./src/common.css'], 
                    (err, out) => {
                        if(err) return console.log(err);
                        fs.writeFile('./style.css', out.styles, err => {
                            if(err) console.log(err);
                        });
                    }
                );
            }
        }
    ]
};