var md5 = require('md5');
var seed = function(User) {
    User.find(function(err, users) {
        if (users.length) return;

        var user = new User({
            uName: 'admin',
            Offlocation: null,
            phone: null,
            pword:md5('admin'),
        }).save();
    });
};

module.exports = {
    seed: seed
};