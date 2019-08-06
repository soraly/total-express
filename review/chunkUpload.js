//简单实现分片上传

//初始化
function initUpload() {
    var chunkSize = 2; //每片大小
    var input = document.getElementById('upload');
    input.onchange = function () {
        var file = this.files[0];
        var start = 0, chunks = {}, length = Math.ceil(file.size / chunkSize);
        console.log(length);
        for (let i = 0; i < length; i++) {
            chunks[i] = file.slice(start, chunkSize);
        }
        //...
        var query = {}
        upload(chunks, query, uploadSuccess);
    }
}

initUpload();

//执行上传
function upload(chunks, query, success_cb) {

}

//每片上传成功后执行
function uploadSuccess() {

}

