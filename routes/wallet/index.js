var express = require('express');
var router = express.Router();
//const newMnemonic = require('./wallet')

router.get('/wallet', function(req, res, next) {
  res.send('ㅇㅏ 좀 돼라!');
});

module.exports = router;