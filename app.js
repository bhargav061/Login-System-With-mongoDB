var express = require('express'),
    handlebars = require('express-handlebars'),
    cookieParser = require('cookie-parser'),
    sessions = require('express-session'),
    bodyParser = require('body-parser'),
    md5 = require('md5'),
    mongoose = require('mongoose'),
    credentials = require('./credentials'),
    Users = require('./models/profiles.js');
    seedDB = require('./models/seed');

var app = express();
app.engine('handlebars', handlebars({
    defaultLayout: 'main',
}));

//TODO: Paste your connection String here.
var connectionString = "mongodb://localhost:27017/userCred";

mongoose.connect(connectionString,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
seedDB.seed(Users);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(credentials.cookieSecret));
app.use(sessions({
    resave: true,
    saveUninitialized: false,
    secret: credentials.cookieSecret,
    cookie: {maxAge: 3600000},
}));

//app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3100);

app.get('/', function(req, res){
    res.render('login');
});

function checklogin (req, res, user, password) {
    Users.findOne({uName: user}, function(err, user) {
        if (err) {
            res.render('login',{message: 'Error accessing database. Try again'});
        } else if (user.pword == md5(password)) {
            req.session.userName = req.body.uname;
            res.redirect(303, 'users/'+user.uName);
        } else {
            res.render('login',{message: 'Username or password was not valid. Try again'});
        }
    });
};

app.post('/processLogin', function(req, res){
    //Determine if user is registering
    if (req.body.buttonVar == 'login') {
        checklogin(req, res, req.body.uname.trim(), req.body.pword.trim())
    } else {
        res.redirect(303, 'register');
    }
});

app.post('/processReg', function(req, res){
    if (req.body.pword.trim() == req.body.pword2.trim()) {
        var newUser = Users({
            uname: req.body.uname,
            offLocation: req.body.Offloaction,
            phoneNo: req.body.phone,
            pass: md5(req.body.pword),
        });
        newUser.save(function(err) {
            if (err) {
                console.log('Error adding new user ' + err);
            }
        });
        req.session.userName = req.body.uname;
        res.redirect(303, 'users/'+user.uName);
    } else {
        res.render('register',{message: 'Passwords did not match. Try again'})
    }
    Users.find(function(err, users) {
        if (err) {
            console.log('error');
        }
        console.log(users);
        console.log("length: " + users.length);

    });
});

app.get('/home', function(req, res) {
    if (req.session.userName) {
        res.render('home');
    } else {
        res.render('login',{message: 'Please login to access the home page'});
    }
});

app.get('/users/:username', (req, res) => {
    if (req.session.userName) {
        var contextObj = {
            uName: req.params.username,
        };
        Users.findOne({uName: req.params.username}, function (err, user) {
            if (err) {
                console.log('Error finding user: ' + req.params.username + ' Error: ' + err);
            }
            if(user === undefined){
                console.log('Error finding user: ' + req.params.username + ' Error: ' + err);
            }

            if(user.Offlocation === null && user.phone === null){
                contextObj.offLocation = 'null';
                contextObj.phoneNumbr = 'null';
            } else if(user.Offlocation === null && user.phone != null){
            contextObj.offLocation = 'null';
            contextObj.phoneNumbr = user.phone;
            } else if(user.Offlocation != null && user.phone === null){
                contextObj.offLocation = user.Offlocation;
                contextObj.phoneNumbr = 'null';
            }
              else{
                  contextObj.offLocation = user.Offlocation;
                  contextObj.phoneNumbr = user.phone;
            }
            res.render('users', {
                uname: contextObj.uName,
                Offlocation: contextObj.offLocation,
                phone: contextObj.phoneNumbr
            });
        });
    } else {
        res.render('login',{message: 'Please login to access the home page'});
    }
});

app.get('/updateInfo', (req,res) => {
    if (req.session.userName) {
        res.render('updateInfo', {name: req.session.userName});
    } else {
        res.render('login',{message: 'Please login to access the second page'});
    }
});
app.get('/register', function(req, res) {
    res.render('register');
});

app.get('/logout', function(req, res) {
    delete req.session.userName;
    res.redirect(303,'/');
});

app.post('/process', function(req, res){
   var updateObj = {
       Offlocation: req.body.newLocationValue,
        phone: req.body.newPhoneValue,
   };

    Users.findOneAndUpdate({uName: req.session.userName}, updateObj, function( err, user){
       if(err){
           console.log("Error Updating record");
       }
       var name = req.session.userName;
       res.redirect(303,'users/'+name);
    });
});
app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate');
});


process.on('unhandledRejection', error => {
    // Will print "unhandledRejection err is not defined"
    console.log('unhandledRejection', error.message);
});