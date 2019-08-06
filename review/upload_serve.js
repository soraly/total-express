const http = require('http');
const url = require('url');
const querystring = require('querystring');
const fs = require('fs');

const app = http.createServer((req, res) => {

    let parsed_url = url.parse(req.url);

    if (parsed_url.pathname === '/uploadGet') { //匹配路由

        let query = parsed_url.query; //获取url的query：id=xx&name=xx
        let queryObj = querystring.parse(query);  //将query字符串转换成对象：{id:xx, name:xx}

        res.writeHead(201, { 'content-type': 'text/html' })
        res.end(`<h2>${JSON.stringify(queryObj)}</h2>`); 
    }

    if (parsed_url.pathname === '/uploadPost') {
        // 定义了一个post变量，用于暂存请求体的信息
        var postData = '';
        var ws = fs.createWriteStream('./uploadedFiles/4.txt');
        
        req.on('data', chunk => {
            console.log(chunk);
            ws.write(chunk);
            ws.write('hello,xiang');
            postData += chunk;
        })

        req.on('end', () => {
            
            res.writeHead(200, { 'content-type': 'text/plain','Access-Control-Allow-Origin': '*' });
            fs.writeFile('./uploadedFiles/1.jpg', postData,(err,data)=>{
                if(err){
                    console.log(err);
                }else {
                    console.log('write done');
                }
            });
            res.end(postData);
        })
    }

})

app.listen(8899, () => { console.log('listen on 8899') })