'use strict'
const express = require('express');
const request = require('request');
const fs = require('fs');
const Path = require('path');
const Url = require('url');
const app = express();
const face = require('./face');
const multer = require('multer')
const upload = multer({ dest: Path.resolve(__dirname, `./static/imgs`) });

app.use('/', express.static('./static'));
app.use(function (req, res, next) {
    console.log(req.method, req.url);
    next();
});

function downloadImg(req, queryName, cb) {
    let path = req.query[queryName] || '/imgs/jt.jpg';
    let pathObj = Url.parse(path);
    if (pathObj.protocol) {
        if (pathObj.hostname == req.hostname) {
            return cb(pathObj.path);
        }
        let url = path;
        path = '/imgs/' + url.split('/').pop();
        let ws = fs.createWriteStream('./static' + path);
        ws.on('finish', function () {
            cb(path);
        });
        request(url).pipe(ws);
    } else {
        cb(path);
    }
}

app.get('/face', function (req, res) {
    downloadImg(req, 'img', function (imgPath) {
        face.detectface(imgPath, function (err, data) {
            if (err) {
                return res.json(err);
            }
            res.json(data.face);
        })
    });
});

app.get('/facecompare', function (req, res) {
    downloadImg(req, 'imgA', function (imgA) {
        downloadImg(req, 'imgB', function (imgB) {
            face.facecompare(imgA, imgB, function (err, data) {
                if (err) {
                    return res.json(err);
                }
                res.json(data);
            })
        })
    })
})

app.post('/upload', upload.single('file'), function (req, res) {
    if (!req.file) {
        return res.json({ message: 'upload file is null' });
    }
    let newPath = req.file.path + req.file.originalname;
    let url = /imgs/ + newPath.split(req.file.destination+'\\').pop();
    fs.renameSync(req.file.path, newPath);
    res.json({ url: `${req.protocol}://${req.get('host')}${url}` });
});

app.use(function (err, req, res, next) {
    console.log('系统捕捉到异常：', err, err.stack);
    return res.error(err.message, err.status || 500);
});

app.listen(8081, function () {
    console.log('listen at: 127.0.0.1:8081');
});

