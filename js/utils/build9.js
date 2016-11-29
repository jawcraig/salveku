/**
 * Feed the deep9 numbers. Outputs options for deepconf.js. Run with node.
 */

var http = require('http');

const PORT = 8080;

// Return weights
function generateDeep9(t = 0) {

    return [1, 2, 3, 4];
}

http.createServer(function(request, response) {
    response.writeHead(200, { 'Content-Type': 'text/javascript' });

    var result = generateDeep9();
    response.end(`var DEEP9 = [${result}];`)
}).listen(PORT);

console.log(`Running at http://127.0.0.1:${PORT}/!`);