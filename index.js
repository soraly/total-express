const express = require('express')
const static = require('express-static')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser')
//bodyparser只能解析post数据，不能解析post文件
const ejs = require('ejs')
const jade = require('jade')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const consolidate = require('consolidate')
var server = express();
var upload = multer({ dest: './www' })

//设置签名，解析cookies
server.use(cookieParser('abcd'))

//设置session
server.use(cookieSession({
    name: 'lzx_id',
    keys: ['aaa', 'bbb'],
    maxAge: 60 * 60 * 3600
}))

//解析post数据
//server.use(bodyParser.urlencoded({extended: false}))


//处理用户请求
server.use('/', (req, res, next) => {
    //get的请求数据===》req.query
    //post的请求数据===》req.body
    // req.on('data',(data)=>{
    //     console.log(data,'data')
    // })
    // res.write('<h2>hello,xiangl</h2>')
    next()
})

//利用multer上传表单文件
server.post('/upload', upload.single('wenjian'), (req, res, next) => {
    console.log(req.file, 'multer-files');
    res.cookie('name','xiang',{'maxAge': 24*3600*1000})
    console.log(req.cookies, 'req.cookies')
    if (req.file) {
        //如果上传了文件，解析并加上后缀名
        var ext = path.parse(req.file.originalname).ext;
        fs.rename(req.file.path, req.file.path + ext, (err) => {
            if (err) { console.log(err, 'err') } else {
                console.log('rename done')
            }
        })
    }

    console.log(req.body, 'multer-body');
    var data = {
        name: req.body.username,
        password: req.body.password,
        phone: req.body.phone
    }
    res.render('hello.ejs',data);
    res.end('done')
})

//配置模板引擎
//1.输出什么东西
server.set('view engine','html');
//2.模板文件放在哪儿
server.set('views','./views');
//使用哪种模板引擎
server.engine('html', consolidate.ejs);

server.use('/postoss',(req,res)=>{
    res.render('hello.ejs',{name: 'xiang'})
})

//设置静态文件解析目录
server.use(express.static(__dirname + '/views'))

server.listen(6789)
console.log('server listen on 6789')