let path = require('path');
let server = require("./server/server");
// Parse command line options
let program = require('commander');
let bower = require("bower");
program
    .option('-p, --port <port>', 'Port on which to listen to (defaults to 3000)', parseInt)
    .parse(process.argv);
let port = program.port || 3000;
new server.Server({
    port:port
},bower);