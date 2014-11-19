'use strict';

module.exports = function(app, mongoose) {
  var imgStore = require('../lib/img-store')(mongoose.connection.db, mongoose.mongo);

  //images
  app.post('/images/upload', imgStore, function(req, res) {
    if (!req.image) res.status(500).send('image upload error');
    res.send('image uploaded');
  });
};
