let path = require('path');
let server = require("./server/server");
// Parse command line options
let program = require('commander');
let bower = require("bower");
var open = require("open");
program
    .version("0.0.1")
    .option('-p, --port <n>', 'Port for express server (default to 8081)', parseInt)
    .option('-P, --socket-port <n>', 'Port for socket server (default 8082)',parseInt)
    .parse(process.argv);
var serverInstance = new server.Server({
    port:program.port,
    socketPort:program.socketPort
},bower);
//open default browser
open("http://localhost:"+serverInstance.config.port+"/dist/index.html");