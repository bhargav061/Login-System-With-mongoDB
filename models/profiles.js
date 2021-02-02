var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    uName: String,
    Offlocation: String,
    phone: Number,
    pword: String,
});

var User = mongoose.model('User', userSchema);
module.exports = User;