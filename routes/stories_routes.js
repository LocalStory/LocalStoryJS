'use strict';

var Story = require('../models/story');

module.exports = function(app) {
  var jwtAuth = require('../lib/jwt-auth')(app.get('jwtSecret'));

  //add a story
  app.post('/api/stories', jwtAuth, function(req, res) {
    var newStory = new Story();
    newStory.userId = req.user._id;
    newStory.title = req.body.title;
    newStory.storyBody = req.body.storyBody;
    newStory.date = new Date();
    newStory.lat = req.body.lat;
    newStory.lng = req.body.lng;
    newStory.save(function(err, data) {
      if (err) return res.status(500).send('there was an error');
      return res.json(data);
    });
  });

  //get a story
  app.get('/api/stories/single/:storyId', function(req, res) {
    Story.findById(req.params.storyId, function(err, data) {
      if (err) return res.status(500).send('story not found');
      return res.json(data);
    });
  });

  //get a particular user's story
  app.get('/api/stories/user', jwtAuth, function(req, res) {
    Story.find({userId: req.user._id}, function(err, data) {
      if (err) return res.status(500).send('user has no stories');
      return res.json(data);
    });
  });

  //get all stories within certain radius of given lat/lng
  app.get('/api/stories/location', function(req, res) {
    Story.find({
      lat: {$gt: req.headers.latmin, $lt: req.headers.latmax},
      lng: {$gt: req.headers.lngmin, $lt: req.headers.lngmax}},
      function(err, data) {
        if (err) return res.status(500).send('database error');
        return res.json(data);
      });
  });

};
