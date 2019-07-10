const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
    console.log(`url: ${req.url}, methods: ${req.method}`);

    // 将HTTP响应200写入response, 同时设置Content-Type: text/html:
    res.writeHead(201, { 'Content-Type': 'text/html' })

    // 将HTTP响应的HTML内容写入response:
    res.end('<h2>hello,xiang</h2>')
})



const fileServer = http.createServer((req, res) => {
    console.log(`url: ${req.url}, methods: ${req.method}`);

    //获取文件地址
    var fileUrl = __dirname + req.url;

    // 从命令行参数获取root目录，默认是当前目录:
    var root = path.resolve(process.argv[2] || '.'); //root === __dirname



    //判断是不是文件再读取内容
    fs.stat(fileUrl, (err, stat) => {
        if (!err && stat.isFile()) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            //// 将文件流导向response:
            fs.createReadStream(fileUrl).pipe(res);
            return;
            
            //没有必要手动读取文件内容。由于response对象本身是一个Writable Stream，
            //直接用pipe()方法就实现了自动读取文件内容并输出到HTTP响应。
            fs.readFile(fileUrl, 'utf-8', (err, data) => {
                // 将HTTP响应200写入response, 同时设置Content-Type: text/html
                res.writeHead(201, { 'Content-Type': 'text/html' });

                // 将HTTP响应的HTML内容写入response:
                res.end(data)

            })
        } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('404....')
        }

    })



})

fileServer.listen(6688, () => {
    console.log('listen on 6688');
})

url.parse('http://m.igrow.cn/v1/sms?id=123#xixi', true)
/*==> {
  protocol: 'http:',
  slashes: true,
  auth: null,
  host: 'm.igrow.cn',
  port: null,
  hostname: 'm.igrow.cn',
  hash: '#xixi',
  search: '?id=123',
  query: [Object: null prototype] { id: '123' },
  pathname: '/v1/sms',
  path: '/v1/sms?id=123',
  href: 'http://m.igrow.cn/v1/sms?id=123#xixi' } */