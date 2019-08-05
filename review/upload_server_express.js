const express = require('express');
const multer = require('multer');
const upload = multer({dest: './uploadedFiles'});
const path = require('path');
const fs = require('fs');

var app = express()

app.post('/uploadPost', upload.single('lzxfile'), function(req, res, next){
    console.log(req.file,'file');
    if(req.file){
        var ext = path.parse(req.file.originalname).ext;
        console.log(ext,'ext');
        fs.rename(req.file.path,req.file.path+ext,(err,data)=>{
            if(err){
                console.log(err)
            }else {
                console.log('rename done');
            }
        }) 
    }  
    res.send(req.body)
})

app.listen(8899)