/*jshint node:true*/
'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var compress = require('compression');
var cors = require('cors');
var favicon = require('serve-favicon');
var logger = require('morgan');
var fs = require('fs');
var _ = require('underscore');
var port = process.env.PORT || 7201;
var multer = require('multer');
var upload = multer({
    dest: './src/server/uploadFolder'
});
var mime = require('mime');

var environment = process.env.NODE_ENV;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(compress());
app.use(logger('dev'));
app.use(cors());

var router = express.Router();

router.get('/dummyData', function (req, res) {
    res.json({
        message: 'hooray! welcome to our api!'
    });
});

app.use('/api', router);

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

app.get('/ping', function (req, res, next) {
    console.log(req.body);
    res.send('pong');
});

/** Dummy service to return dummy data to simulate query */
router.post('/getJson/:jsonFileName', function (req, res, next) {
    var obj;
    fs.readFile('./src/client/dummyData/' + req.params.jsonFileName + '.json', 'utf8', function (err, data) {
        if (err) throw err;
        obj = JSON.parse(data);
        // console.log(obj);
        res.json(obj);
    });
});

router.post('/filterJson', function (req, res, next) {
    console.log(req.body);
    //{ filename: 'piggybank', propname: 'name', searchText: 'b' }req.body.searchText
    console.log('filterJson api method called with jsonFileName ' + req.body.filename + ' paramKey: ' + req.body.propname + ' paramLikeVal:' + req.body.searchText);
    var obj;
    fs.readFile('./src/client/dummyData/' + req.body.filename + '.json', 'utf8', function (err, data) {
        if (err) throw err;
        obj = JSON.parse(data);
        var filteredObj = _.filter(obj, function (objItem) {
            console.log('searchText in ' + req.body.searchText);
            if (req.body.searchText === '' || req.body.searchText === null || req.body.searchText === undefined) {
                return true;
            } else {
                return objItem[req.body.propname].toString().toLowerCase().indexOf(req.body.searchText.toString().toLowerCase()) !== -1;
            }
        });
        res.json(filteredObj);
    });
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/server/uploadFolder')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});
var upload2 = multer({
    storage: storage
});

/** Accept files to upload into a local directory */
router.post('/uploadFile', upload2.single('file'), function (req, res, next) {
    console.log(req.body);
    console.log(req.file);
    var newUpload = {
        name: req.body.name,
        created: Date.now(),
        file: req.file
    };
});

switch (environment) {
    case 'build':
        console.log('** BUILD **');
        app.use(express.static('./build/'));
        //This is so that application can access sample pages and other
        //non-templateCached pages. We are just templateCaching html
        //files in templates module to make the library injectable.
        app.use(express.static('./src/client/'));
        app.use('/*', express.static('./build/index.html'));
        break;
    default:
        console.log('** DEV **');
        app.use(express.static('./src/client/'));
        app.use(express.static('./'));
        app.use(express.static('./tmp'));
        app.use('/*', express.static('./src/client/index.html'));
        break;
}

app.listen(port, function () {
    console.log('Express server listening on port ' + port);
    console.log('\n__dirname = ' + __dirname +
        '\nprocess.cwd = ' + process.cwd());
});