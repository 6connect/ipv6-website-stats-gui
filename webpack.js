const webpack = require('webpack');
const path = require('path');

const compileHandler = (err, stats) => {
    console.log("webpack: "+Date.now());
    console.log(stats.compilation.options.entry);

    if (err || stats.hasErrors()) {
        console.log(stats.compilation.errors);
        console.log(err);
    }
}

const client_config = {
    entry: __dirname+'/src/js/main.js',
    output: {
        path: __dirname+'/dist',
        filename: 'bundle.js'
    }
};

webpack(client_config).watch({}, compileHandler);
