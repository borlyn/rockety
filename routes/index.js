var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'rocketchat' });
});
router.get('/chatroom', function(req, res) {
  res.render('chatroom', {title: 'rocketchat'});
});
module.exports = router;

