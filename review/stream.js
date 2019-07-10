const fs = require('fs')

//打开一个流:
const RS = fs.createReadStream('./assets/hello2.txt'); //如果需要获取字符串==》fs.createReadStream('./assets/hello.txt','utf-8')

RS.on('data',chunk=>{
    console.log(chunk,'chunk')
})

RS.on('end',res=>{
    console.log('readDone',res);
})

RS.on('error',res=>{
    console.log('readError ',res);
})

//写入流
const WS = fs.createWriteStream('./assets/hello.txt');
WS.write('xixi,haha');
WS.write('End...');
WS.end();
//所有可以读取数据的流都继承自stream.Readable，所有可以写入的流都继承自stream.Writable。



/*  pipe */
/* 就像可以把两个水管串成一个更长的水管一样，两个流也可以串起来。一个Readable流和一个Writable流串起来后，
所有的数据自动从Readable流进入Writable流，这种操作叫pipe。

在Node.js中，Readable流有一个pipe()方法，就是用来干这件事的。

让我们用pipe()把一个文件流和另一个文件流串起来，这样源文件的所有数据就自动写入到目标文件里了，所以，这实际上是一个复制文件的程序： */
const ws2 = fs.createWriteStream('./assets/hello3.txt');
RS.pipe(ws2)
