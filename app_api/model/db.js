var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost:27017/paulsBlog';
require('./article');
require('./users');

mongoose.connect(dbURI, { useNewUrlParser: true });

mongoose.connection.on('connected', () => console.log('Mongoose connected to ' + dbURI));
mongoose.connection.on('error', (err) => console.log('Mongoose connection error: ' + err));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconected from ' + dbURI));


// reusable db connection close function
var gracefulShutdown = function(msg, callback) {
        mongoose.connection.close(function(msg) {
            console.log(msg);
            callback();
        })
    }
    // For nodemon restarts
process.once('SIGUSR2', function() {
    gracefulShutdown('nodemon restart', function() {
        process.kill(process.pid, 'SIGUSR2');
    });
});
// For app termination
process.on('SIGINT', function() {
    gracefulShutdown('app termination', function() {
        process.exit(0);
    });
});
// For Heroku app termination
process.on('SIGTERM', function() {
    gracefulShutdown('Heroku app shutdown', function() {
        process.exit(0);
    });
});