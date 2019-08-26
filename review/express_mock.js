const express = require('express');
const Mock = require('mockjs')

const app = express();
app.use('/api/1.1b/yo/course/property/relationcourse', (req, res) => {
    res.json(
        Mock.mock({
            'status': 200,
            'data|6': [{
                'key|+1': 1,
                'title|1': ['水果', '书籍', '电视', '音乐'],
                'content|1': ['西瓜', '三国演义', '楚乔传'],
                'action|1': ['试听', '喜欢'],
            }]
        })
    )
})

app.listen('8070',()=>{
    console.log('listen on 8070')
})