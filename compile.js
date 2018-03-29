const fs = require('fs'), 
      path = require('path'), 
      compressor = require('node-minify'), 
      CleanCSS = require('clean-css');

var copy = [];
for(var i = 0; i < copy.length; i++) {
    var rs = fs.createReadStream(copy[i]), 
        ws = fs.createWriteStream("./dist/"+path.basename(copy[i]));
    rs.on("error", function(err) {
        console.log(err);
    });
    ws.on("error", function(err) {
        console.log(err);
    });
    rs.pipe(ws);
}

compressor.minify({
    compressor: 'uglifyjs',
    input: './src/common.js',
    output: './dist/common.min.js',
    callback: function (err, min) {
        if(err) { return console.log(err); }
    }
});
compressor.minify({
    compressor: 'uglifyjs',
    input: './src/common.table.js',
    output: './dist/common.table.min.js',
    callback: function (err, min) {
        if(err) { return console.log(err); }
    }
});
new CleanCSS().minify(
    ['./src/common.css'], 
    function(err, out) {
        if(err) { return console.log(err); }
        fs.writeFile('./dist/common.min.css', out.styles, function(err) {
            if(err) { console.log(err); }
        });
    }
);