var express = require('express');
var router = express.Router();
var db = require('../model/dal/dal');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  db.connect();
});

module.exports = router;
