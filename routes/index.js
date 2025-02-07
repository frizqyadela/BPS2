var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('home', { layout: "layouthome" }); 
});

/* GET beranda page */
router.get('/beranda', function (req, res, next) {
  res.render('beranda', { title: 'Beranda' }); 
});

/* GET beranda page */
router.get('/daftar', function (req, res, next) {
  res.render('daftar', { title: 'Daftar' });
});

/* GET beranda page */
router.get('/tambahakun', function (req, res, next) {
  res.render('tambahakun', { title: 'Tambah Akun' });
});

/* GET beranda page */
router.get('/detail', function (req, res, next) {
  res.render('detail', { title: 'Detail' });
});

/* GET beranda page */
router.get('/dokumen', function (req, res, next) {
  res.render('dokumen', { title: 'Dokumen' });
});

/* GET beranda page */
router.get('/tambahkwitansi', function (req, res, next) {
  res.render('tambahkwitansi', { title: 'Tambah Kwitansi' });
});

/* GET beranda page */
router.get('/editkwitansi', function (req, res, next) {
  res.render('editkwitansi', { title: 'Edit Kwitansi' });
});

/* GET beranda page */
router.get('/editakun', function (req, res, next) {
  res.render('editakun', { title: 'Edit Akun' });
});

module.exports = router;
