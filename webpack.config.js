const webpack  = require('webpack'), 
      path     = require('path'), 
      fs       = require('fs'), 
      CleanCSS = require('clean-css');

module.exports = {
    mode: 'production', 
    entry: {
        common: {
            import: './src/entry.js', 
            library: {
                name:   'common', 
                type:   'umd', 
                export: 'default'
            }
        }, 
        CommonTable: {
            import: './src/common.table.js', 
            library: {
                name:   'CommonTable', 
                type:   'umd', 
                export: 'default'
            }
        }
    }, 
    output: {
        globalObject: 'this', 
        path:         path.resolve(__dirname), 
        filename:     '[name].js'
    },
    module: {
        rules: [
            {
                test:    /\.js$/,
                exclude: /(node_modules)/,
                loader:  'babel-loader', 
                options: {presets: ['@babel/preset-env']}
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