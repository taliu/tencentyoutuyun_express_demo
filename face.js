'use strict'
const tencentyoutuyun = require('tencentyoutuyun');
const youtu = tencentyoutuyun.youtu;
const fs = require('fs');
const config = require('./config');
// 设置开发者和应用信息, 请填写你在开放平台
let userid = '1';
tencentyoutuyun.conf.setAppInfo(config.appid, config.secretId, config.secretKey, userid, 0);

let cache = {};

function getFullPath(imgPath) {
    imgPath = './static' + imgPath;
    if (!fs.existsSync(imgPath)) {
        return null;
    }
    return imgPath;
}
function getResult(data) {
    let result ={err:null,data:null}
    if (!data) {
        result.err = { errorcode: -1, errormsg: '未知错误' }
        return result;
    }
    if(!~data.httpcode.toString().indexOf('20')){//HTTP状态码
       result. err = { errorcode: data.code, errormsg:data.message}
        return result;
    }
    if (!data.data) {
        result.err = { errorcode: -1, errormsg: '未知错误' }
        return result;
    }
    if (data.data.errorcode != 0) {
       result.err = { errorcode: data.errorcode, errormsg: data.errormsg }
    }
    result.data= data.data;
    return result;
}
exports.detectface = function(imgPath, cb) {
    if (cache[imgPath]) {
        return cb(null,cache[imgPath]);
    }
    imgPath = getFullPath(imgPath);
    if (!imgPath) {
       return  cb({ errormsg: imgPath + ' 文件不存在' },null);
    }
    youtu.detectface(imgPath, 0, function(data) {
        let result=getResult(data);
        !result.err&&(cache[imgPath] = result.data);
        cb(result.err,result.data);
    });
};

exports.facecompare = function(imgPathA, imgPathB, cb) {
    imgPathA = getFullPath(imgPathA);
    if (!imgPathA) {
       return  cb({ errormsg: imgPathA + ' 文件不存在' },null);
    }
     imgPathB = getFullPath(imgPathB);
    if (!imgPathB) {
       return  cb({ errormsg: imgPathB + ' 文件不存在' },null);
    }
   let  imgPath =imgPathA+imgPathB;
    if (cache[imgPath]) {
        return cb(null,cache[imgPath]);
    }
     youtu.facecompare(imgPathA, imgPathB, function(data) {
        let result=getResult(data);
        !result.err&&(cache[imgPath] = result.data);
        cb(result.err,result.data);
    })
}

