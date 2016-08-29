const path = require("path");
let base = process.cwd();
const config = {
    base:base,
    dist:path.resolve(base,"./dist"),
    src:path.resolve(base,"./src"),
    backend:{
        entry:path.resolve(base,'./src/index.js'),
        dist:'backend.js'
    },
    client:{
        entry:{
            app:[
                path.resolve(base,'./src/client/App.tsx')
            ],
            vendor:[
                "react",
                "react-dom",
                "react-router",
                "material-ui"
            ]
        },
        dist:'client.js'
    }
};
module.exports = config;
