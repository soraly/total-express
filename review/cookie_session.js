/*一、cookie：
在网站中，http请求是无状态的。也就是说即使第一次和服务器连接后并且登录成功后，第二次请求服务器依然不能知道当前请求是哪个用户。
cookie的出现就是为了解决这个问题，第一次登录后服务器返回一些数据（cookie）给浏览器，然后浏览器保存在本地，当该用户发送第二次请求的时候，
就会自动的把上次请求存储的cookie数据自动的携带给服务器，服务器通过浏览器携带的数据就能判断当前用户是哪个了。
cookie存储的数据量有限，不同的浏览器有不同的存储大小，但一般不超过4KB。因此使用cookie只能存储一些小量的数据。

二、session:
session和cookie的作用有点类似，都是为了存储用户相关的信息。不同的是，cookie是存储在本地浏览器，而session存储在服务器。
存储在服务器的数据会更加的安全，不容易被窃取。但存储在服务器也有一定的弊端，就是会占用服务器的资源，但现在服务器已经发展至今，
一些session信息还是绰绰有余的。

三、cookie和session结合使用：
web开发发展至今，cookie和session的使用已经出现了一些非常成熟的方案。在如今的市场或者企业里，一般有两种存储方式：

1、存储在服务端：通过cookie存储一个session_id，然后具体的数据则是保存在session中。如果用户已经登录，则服务器会在cookie中
保存一个session_id，下次再次请求的时候，会把该session_id携带上来，服务器根据session_id在session库中获取用户的session数据。
就能知道该用户到底是谁，以及之前保存的一些状态信息。这种专业术语叫做server side session。

2、将session数据加密，然后存储在cookie中。这种专业术语叫做client side session。flask采用的就是这种方式，但是也可以替换成其他形式。*/

var http = require('http')
var express = require('express')
const cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session')

var app = express();

//cookieParser的作用是给req增加cookies属性，可以访问已经存储的cookie，加字符串是为了给cookie签名
// 先解析客户端传过来的cookie,然后才能用cookie中的sessionID
app.use(cookieParser('xiang'))

app.use(cookieSession({
    //name: 'lzxsession2',
    keys: ['aaa', 'bbb', 'ccc'], // session需要传递一个keys进行加密，加在server上，给一个数组即有多个密钥提高安全性
    maxAge: 48 * 3600 * 1000
}))

app.get('/test', (req, res, next) => {
    next();
    //设置cookie
    res.cookie('singedcookiename', 'test', { httpOnly: true, maxAge: 60 * 60 * 1000, signed: true })
    res.cookie('nosigncookie', 'heheda', { httpOnly: true, maxAge: 60 * 60 * 1000 })

    //没有签名的cookie可以直接获取
    console.log(req.cookies)

    //已经签名的cookie用singedcookies来获取
    console.log(req.signedCookies)

    //session的作用是第一次创建Session的时候，服务端会在HTTP协议中告诉客户端，需要在 Cookie 
    //里面记录一个Session ID，以后每次请求把这个会话ID发送到服务器，我就知道你是谁了。
    if (req.session['num']) {
        req.session['num']++
    } else {
        req.session['num'] = 100;
    }
    console.log(req.session, 'session')
    res.end('test')
})


app.listen(7899, (res) => {
    console.log('server listen on 7899')
})