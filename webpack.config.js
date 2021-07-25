const path=require('path');


module.exports={

    context:__dirname,
    entry:'./views/resources/script.js',
    output:{
        path:path.resolve(__dirname,'public/js'),
        filename:'script.js'
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                exclude:/node_modules/,
                use:'babel-loader'
            }
        ]
    }
};