var express = require('express');

var server = express();
//1.创建router
const router = express.Router();

//2.设置router内容
router.get('/add',(req,res)=>{
    res.send('this is add')
})
router.get('/login',(req,res)=>{
    res.send('this is login')
})

//3.把router添加到server
server.use('/user',router)

server.listen('8989',()=>{
    console.log('server listen on 8989')
})