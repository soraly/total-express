//crypto模块的目的是为了提供通用的加密和哈希算法。用纯JavaScript代码实现这些功能不是不可能，但速度会非常慢。
//Nodejs用C/C++实现这些算法后，通过cypto这个模块暴露为JavaScript接口，这样用起来方便，运行速度也快。

var crypto = require('crypto');
var hash = crypto.createHash('md5')

hash.update('hello')

var buffer = Buffer.from('hello')

console.log(hash.digest('hex')) //5d41402abc4b2a76b9719d911017c592
console.log(buffer)