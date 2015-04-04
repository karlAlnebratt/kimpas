"use strict";

var express = require('express');
var jwt = require('jwt-simple');
var auth = require('http-auth');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var filePath = path.join(__dirname, '../data/content.json');

var basic = auth.basic({
    realm: "Simon Area.",
    file: path.join(__dirname, '../data/users.htpasswd')
});

var secret = 'xxx';
var token;

router.use(auth.connect(basic));

/* GET home page. */
router.get('/', function(req, res, next) {
    // encode
    token = jwt.encode({user: req.user}, secret);
    fs.readFile(filePath, {encoding: 'utf-8'}, function (err, data) {
        var isLogedIn = true;
        if (err) {
            next(err);
        } else {
            var content = Object.assign({
                isLogedIn: isLogedIn,
                token: token
            }, JSON.parse(data));

            res.render('index', content);
        }
    });
});

//Save data
router.post('/', function (req, res, next) {
    var data = req.body;
    // decode
    var decoded = jwt.decode(req.headers['x-access-token'], secret);
    debugger

    if(!decoded && decoded.user !== token.user) {
        return res.status(401).send('Unauthorized');
    }

    fs.writeFile(filePath, JSON.stringify(data, null, 4), function(err) {
        if (err) {
            next(err);
        } else {
            res.type('json');
            res.send({});
        }
    });

});

module.exports = router;
