const express = require('express')
const static = require('express-static')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser')
//bodyparser只能解析post数据，不能解析post文件
const ejs = require('ejs')
const jade = require('jade')
const multer = require('multer')

var server = express();
var upload = multer({dest: 'www/'})

//设置签名，解析cookies
server.use(cookieParser('abcd'))

//设置session
server.use(cookieSession({
    name: 'lzx_id',
    keys: ['aaa', 'bbb'],
    maxAge: 60*60*3600
}))

//解析post数据
//server.use(bodyParser.urlencoded({extended: false}))


//处理用户请求
server.use('/',(req,res,next)=>{
    //get的请求数据===》req.query
    //post的请求数据===》req.body

    // req.on('data',(data)=>{
    //     console.log(data,'data')
    // })
    // res.write('<h2>hello,xiangl</h2>')
    // res.end()
    next()
})

//利用multer上传表单文件
server.post('/upload', upload.array('wenjian',2), (req,res,next)=>{
    console.log(req.files,'multer-files');
    console.log(req.body, 'multer-body');
    res.end('done')
})


//设置静态文件解析目录
server.use(express.static(__dirname + '/views'))

server.listen(6789)
console.log('server listen on 6789')