var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var user = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, required: true, unique: true },
    salt: String,
    hash: String
});

var visitor = new mongoose.Schema({
    email: { type: String, required: true },
    message: { type: String, required: true }
});


user.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
}

user.methods.validatePassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return hash === this.hash;
}

user.methods.generateJWT = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    return jwt.sign({
        _id: this.id,
        email: this.email,
        name: this.firstName + this.lastName,
        expiry: parseInt(expiry.getDate())
    }, 'iamtheoneandonly')
}

mongoose.model('User', user);
// mongoose.model('Visitor', visitor);