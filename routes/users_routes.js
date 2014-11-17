'use strict';

var User = require('../models/user');

module.exports = function(app, passport) {
  //add user
  app.post('/api/users', function(req, res) {

    User.findOne({'basic.email': req.body.email}, function(err, user) {
      if (err) return res.status(500).send('server error');
      if (user) return res.status(500).send('cannot create that user');
      if (req.body.password !== req.body.passwordConfirm) return res.status(500).send('passwords do not match');

      var newUser = new User();
      newUser.basic.email = req.body.email;
      newUser.basic.password = newUser.generateHash(req.body.password);
      newUser.save(function(err, data) {
        if (err) return res.status(500).send('server error');
        res.json({jwt: newUser.generateToken(app.get('jwtSecret'))});
      });
    });
  });

  //sign user in
  app.get('/api/users/', passport.authenticate('basic', {session: false}), function(req, res) {
    return res.json({jwt: req.user.generateToken(app.get('jwtSecret'))});
  });

};
