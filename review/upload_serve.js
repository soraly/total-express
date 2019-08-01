const http = require('http');
const url = require('url');
const querystring = require('querystring')

const app = http.createServer((req, res) => {

    let parsed_url = url.parse(req.url);

    if (parsed_url.pathname === '/uploadGet') { //上传文件

        let query = parsed_url.query;
        let queryObj = querystring.parse(query);
        console.log(queryObj, 'queryObj')

        res.writeHead(201, { 'content-type': 'text/html' })
        res.end(`<h2>${JSON.stringify(queryObj)}</h2>`);
    }

    if (parsed_url.pathname === '/uploadPost') {
        // 定义了一个post变量，用于暂存请求体的信息
        var postData = '';
        req.on('data', chunk => {
            console.log(chunk, 'chunk')
            postData += chunk
        })
        req.on('end', () => {
            console.log(postData, 'postData');
            res.writeHead(201, { 'content-type': 'text/plain' });
            res.end(postData);
        })
    }

})

app.listen(8899, () => { console.log('listen on 8899') })