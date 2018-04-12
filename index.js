const express = require('express')
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
const mysql = require('mysql')
const urlLib = require('url')
var server = express();
var upload = multer({dest: './template/uploadedImg'})
console.log('new branch');
console.log('lallaal..')
//测试NODE_ENV
console.log(process.env.NODE_ENV,'process.env.NODE_ENV')
if(process.env.NODE_ENV == 'develop'){
    console.log('this is in develop')
}

//连接池
var db = mysql.createPool({
    port: 3306,
    host: 'localhost',
    database: 'blog_db',
    user: 'root',
    password: 'lzx123'
})
const router = express.Router()
router.get('/login', (req, res) => {
    res.render('login.ejs')
})
router.get('/register', (req, res) => {
    res.render('register.ejs')
})
server.use('/user', router)
//设置签名，解析cookies
server.use(cookieParser('abcd'))

//设置session
server.use(cookieSession({
    name: 'lzx_id',
    keys: ['aaa', 'bbb'],
    maxAge: 60 * 60 * 3600
}))

//解析post数据
server.use(bodyParser.urlencoded({extended: false}))


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
    res.cookie('name', 'xiang', {'maxAge': 24 * 3600 * 1000})
    console.log(req.cookies, 'req.cookies')
    if (req.file) {
        //如果上传了文件，解析并加上后缀名
        var ext = path.parse(req.file.originalname).ext;
        fs.rename(req.file.path, req.file.path + ext, (err) => {
            if (err) {
                console.log(err, 'err')
            } else {
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
    res.render('hello.ejs', data);
    res.end('done')
})

//配置模板引擎
//1.输出什么东西
server.set('view engine', 'html');
//2.模板文件放在哪儿
server.set('views', './template');
//使用哪种模板引擎
server.engine('html', consolidate.ejs);

server.use('/postoss', (req, res) => {
    res.render('hello.ejs', {name: 'xiang'})
})


function getBanner(res) {
    return new Promise((resolve, reject) => {
        var sql = 'SELECT * FROM `banner_table`';
        db.query(sql, (err, data) => {
            if (err) {
                res.status(400).send('服务器错误').end()
                reject()
            } else {
                res.banners = data;
                resolve(data)

            }
        })
    })
}

function getModules(res) {
    return new Promise((resolve, reject) => {
        var sql2 = 'SELECT * FROM `module_table`'
        db.query(sql2, (err, data) => {
            if (err) {
                res.status(400).send('database error').end()
                reject()
            } else {
                res.modules = data;
                resolve(data)
            }
        })
    })
}

function getSummary(res) {
    var sql3 = 'SELECT id, auth_avatar, summary FROM `content_table`';
    return new Promise((resolve, reject) => {
        db.query(sql3, (err, data) => {
            if (err) {

            } else {
                res.contents = data;
                resolve()
            }
        })
    })
}

function getContent(id, res) {
    var sql3 = 'SELECT * FROM `content_table` WHERE id =' + id;
    return new Promise((resolve, reject) => {
        db.query(sql3, (err, data) => {
            if (err) {
                res.status(500).send('error...').end()
            } else {
                resolve(data)
            }
        })
    })
}

function addContent(data,res) {
    return new Promise((resolve, reject) => {
        var sql = `INSERT INTO content_table VALUES(null, '${data.auth}', '${data.auth_avatar}', '${data.title}', '${data.content}', '${data.summary}', '${data.n_praise}', '${data.post_time}' )`;
        db.query(sql,(err, data)=>{
            if (err) {
                console.log(err,'err');
                res.status(500).send('写入数据错误').end();
            } else {
                console.log(data,'data')
                resolve()
            }
        })
    })
}

server.all('/', (req, res, next) => {
    Promise.all([getBanner(res), getModules(res), getSummary(res)]).then((result) => {
        res.render('index.ejs', {
            banners: res.banners,
            modules: res.modules,
            contents: res.contents
        })
    })
})
server.get('/content', (req, res) => {
    // var p_url = urlLib.parse(req.url, true)
    // var id = p_url.query.id;
    var id = req.query.id;
    getContent(id, res).then((data) => {
        res.render('content.ejs', {content: data[0]})
    })
})
server.get('/add', (req, res) => {
    res.render('add.ejs', {})
})

//接收form表单提交的数据，用multer接收file文件
server.post('/uploadData',upload.single('photo'),  (req, res) => {
    var data = {
        auth: '刘志翔',
        auth_avatar: 'images/p5.jpg',
        title: req.body.title,
        content: req.body.content,
        summary: req.body.content,
        n_praise: 10,
        post_time: Math.round(+new Date() / 1000)
    }
    if(req.file){
        var ext = path.parse(req.file.originalname).ext;
        fs.rename(req.file.path, req.file.path+ext,()=>{
            data.auth_avatar = 'uploadedImg/' + req.file.filename + ext;
            addContent(data,res).then(()=>{
                //路由跳转，需要先重定向，参见 https://www.cnblogs.com/duhuo/p/5609127.html
                res.redirect(301, 'http://localhost:6789')
            })
        })
    }else{
        addContent(data,res).then(()=>{
            res.redirect(301, 'http://localhost:6789');
        })
    }
})
//原生接收form的file数据
server.all('/uploadOrigin',(req,res)=>{
    var buf = Buffer.alloc(0);
    req.on('data',(data)=>{
        buf = Buffer.concat([buf,data]);
    })
    req.on('end',()=>{
        console.log(buf,'buf');
        fs.writeFile('test2',buf);
        res.redirect(301, 'http://localhost:6789');
    })
})

//设置静态文件解析目录
server.use(express.static(__dirname + '/template'));

server.listen(6789);
console.log('server listen on 6789');