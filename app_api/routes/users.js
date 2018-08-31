var express = require('express');
var router = express.Router();

var userCtrl = require('../controllers/users');

router.get('/:id', userCtrl.readUser);
router.post('/create', userCtrl.createUser);
router.post('/delete/:id', userCtrl.deleteUser);
router.post('/update/:id', userCtrl.updateUser);
router.post('/login', userCtrl.loginUser);
router.post('/logout/:id', userCtrl.logoutUser);

module.exports = router;