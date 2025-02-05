var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET beranda page */
router.get('/beranda', function (req, res, next) {
  res.render('beranda', { title: 'Beranda' }); 
});

/* GET beranda page */
router.get('/daftar', function (req, res, next) {
  res.render('daftar', { title: 'Express', layout: "layout" });
});


module.exports = router;
