const express = require('express')
const app = express()
const mysql = require('mysql')
const router = express.Router();

const Validator = {
    make(query, rules){
        var mark = false;
        console.log(query, rules);
        return {
            fail: mark
        }
    }
}

var db = mysql.createPool({
    port: 3306,
    host: 'localhost',
    database: 'blog_db',
    user: 'root',
    password: 'lzx123'
})

router.get('/profile/get',(req,res)=>{
    //validator query
    const rules = {
        'id': 'integer|min:1',
        'semesterid' : 'integer|min:0',
        'classid' : 'required_without:id|integer|min:1',
    };
    var validator = Validator.make(req.query, rules);

    if (validator.fail) {
        return ApiResponse.error(validator.messages());
    }

    var id = req.query.id;
    if(id){
        var sql3 = 'SELECT * FROM `yo_classprofiles` WHERE id =' + id;
        db.query(sql3, (err, data) => {
            if (err) {
                res.status(500).send(err).end()
            } else {
                res.send({
                    code: 0,
                    data,
                    extra: {}
                });
            }
        })
    }else {
        var classid = req.query.classid;
        var sql3 = 'SELECT * FROM `yo_classprofiles` WHERE classid =' + classid;
        db.query(sql3, (err, data) => {
            if (err) {
                res.status(500).send(err).end()
            } else {
                res.send({
                    code: 0,
                    data,
                    extra: {}
                });
            }
        })
    }
})

router.get('/api/1.1b/yo/qualitysy/tag/list',(req,res)=>{
    var schoolid = req.query.schoolid;
        var sql3 = 'SELECT * FROM `yo_qualitysy_tag` WHERE schoolid =' + schoolid;
        db.query(sql3, (err, data) => {
            if (err) {
                res.status(500).send(err).end()
            } else {
                res.send({
                    code: 0,
                    data,
                    extra: {}
                });
            }
        })
})

function getProfile(id, res) {
    var sql3 = 'SELECT * FROM `yo_classprofiles` WHERE id =' + id;
    return new Promise((resolve, reject) => {
        
    })
}
module.exports = router;
