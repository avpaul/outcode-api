var express = require('express');
var router = express.Router();

var otherctrl = require('../controllers/others');

router.post('/message', otherctrl.message);
router.post('/visitor/:ipa', otherctrl.visitorsCount);

module.exports = router;