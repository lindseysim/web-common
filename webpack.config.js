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
        path: path.join(path.resolve(__dirname), "dist"), 
        filename: (chunkData) => {
            return (
                chunkData.chunk.name
                    .match(/([A-Z]?[^A-Z]*)/g).slice(0,-1)  // split words by capitals, handle camelcase
                    .map((word) => word.toLowerCase())      // to lowercase
                    .join(".")                              // join by period
                + ".min.js"
            );
        }
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
            apply: (compiler) => {
                new CleanCSS().minify(
                    ['./src/common.css'], 
                    function(err, out) {
                        if(err) return console.log(err);
                        fs.writeFile('./dist/common.min.css', out.styles, function(err) {
                            if(err) console.log(err);
                        });
                    }
                );
            }
        }
    ]
};