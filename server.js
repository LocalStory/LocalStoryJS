'use strict';

var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var express = require('express');
var app = express();

mongoose.connect(process.env.MONGOOSE || 'mongodb://localhost/localStory_dev');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('jwtSecret', process.env.SECRET || 'REMEMBERTOCHANGETHIS');

app.use(passport.initialize());
require('./lib/passport')(passport);

require('./routes/users_routes')(app, passport);
require('./routes/stories_routes')(app, mongoose);

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
  console.log('server started on port %d', app.get('port'));
});

module.exports = app;
