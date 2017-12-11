var http = require('http');
http.createServer((req,res)=>{
    res.writeHead(200,{'content-type':'text/html'})
    res.write('<h2>hello</h2>');
    res.end()
}).listen(8899)
