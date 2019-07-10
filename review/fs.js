const fs = require('fs')

//异步读取文件
console.log('start');
fs.readFile('./assets/hello.txt','utf-8',(err,data)=>{
    console.log('reading...')
    if(err){
        console.log(err,'err')
    }else {
        console.log(data,'utf-8文本');      
    }
})
console.log('end');

//同步读取文件
console.log('start2')
var data = fs.readFileSync('./assets/hello.txt'); //如果同步读取文件发生错误，则需要用try...catch捕获该错误：
console.log(data, 'Buffer对象');
console.log('end2');

//写文件
const val = 'hello,xiang'
fs.writeFile('./assets/hello2.txt',val,(err,data)=>{
    if(err){
        console.log(err,'err')
    }else {
        console.log('writeDone');      
    }
})

//获取文件状态
fs.stat('./assets/hello.txt',(err,stat)=>{
    if(err){
        console.log(err,'err')
    }else {
        console.log('isFile',stat.isFile());      
        console.log('isDirectory',stat.isDirectory());      
        if(stat.isFile()){
            console.log('文件',`size: ${stat.size}, birthtime: ${stat.birthtime}`)
        }
    }
})