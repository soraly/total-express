const express = require('express');
const multer = require('multer');
const upload = multer({ dest: './uploadedFiles' }); //设置图片的保存路径
const path = require('path');
const fs = require('fs');

var app = express()

app.post('/uploadPost', upload.single('lzxfile'), function (req, res, next) { //lzxfile为上传input的name
    
    if (req.file) {
        var ext = path.parse(req.file.originalname).ext; //获取上传的文件名后缀
        
        fs.rename(req.file.path, req.file.path + ext, (err, data) => { //因为express另存为的文件默认没有后缀，所以需要加下
            if (err) {
                console.log(err);
            } else {
                console.log('rename done');
            }
        })
    }
    res.send(req.body)
})

app.listen(8899)