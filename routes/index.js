var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var filePath = path.join(__dirname, '../data/content.json');

/* GET home page. */
router.get('/', function(req, res, next) {
    fs.readFile(filePath, {encoding: 'utf-8'}, function (err, data) {

        var isLogedIn = false;
        if (err) {
            next(err);
        } else {
            var content = Object.assign({
                isLogedIn: isLogedIn
            }, JSON.parse(data));

            res.render('index', content);
        }
    });
});

module.exports = router;
