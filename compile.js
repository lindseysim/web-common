const fs = require('fs');
const compressor = require('node-minify');
const CleanCSS = require('clean-css');

compressor.minify({
    compressor: 'uglifyjs',
    input: './src/common.js',
    output: './common.min.js',
    callback: function (err, min) {
        if(err) { return console.log(err); }
    }
})

compressor.minify({
    compressor: 'uglifyjs',
    input: './src/common.table.js',
    output: './common.table.min.js',
    callback: function (err, min) {
        if(err) { return console.log(err); }
    }
})
new CleanCSS().minify(
    ['./src/common.css'], 
    function(err, out) {
        if(err) { return console.log(err); }
        fs.writeFile('./common.min.css', out.styles, function(err) {
           if(err) { console.log(err); }
        });
    }
);