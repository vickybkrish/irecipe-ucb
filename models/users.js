const orm = require('../config/orm.js');
const passport = require('passport');


const accounts = {
    LogIn: function(callback) {
        orm.LogIn(passport, 'users', 'username', username, password)
    }

}

module.exports = accounts;
