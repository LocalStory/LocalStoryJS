'use strict';

var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var express = require('express');
var app = express();

mongoose.connect(process.env.MONGOOSE || 'mongodb://localhost/localStory_dev');
app.set('jwtSecret', process.env.SECRET || 'REMEMBERTOCHANGETHIS');
var formParser = require('./lib/form-parser')(mongoose.connection.db, mongoose.mongo);

app.use(passport.initialize());
require('./lib/passport')(passport);

app.use(bodyParser.urlencoded({extended: false}));
//app.use(bodyParser.json());
app.use(formParser);

require('./routes/users_routes')(app, app.get('jwtSecret'), passport);
require('./routes/stories_routes')(app, app.get('jwtSecret'), mongoose);

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
  console.log('server started on port %d', app.get('port'));
});

module.exports = app;
