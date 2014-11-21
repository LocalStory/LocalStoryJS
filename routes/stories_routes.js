'use strict';

var grid = require('gridfs-stream');
var Story = require('../models/story');
var updateObject = require('../lib/update-obj');

module.exports = function(app, appSecret, mongoose) {
  var jwtAuth = require('../lib/jwt-auth')(appSecret);
  var permissions = require('../lib/permissions');
  var formParser = require('../lib/form-parser')(mongoose.connection.db, mongoose.mongo);
  var removeImage = require('../lib/remove-image')(mongoose.connection.db, mongoose.mongo);

  //add a story
  app.post('/api/stories', jwtAuth, formParser, function(req, res) {
    var newStory = new Story();
    newStory.userId = req.user._id;
    newStory.title = req.body.title;
    newStory.storyBody = req.body.storyBody;
    newStory.date = new Date();
    newStory.lat = req.body.lat;
    newStory.lng = req.body.lng;
    if (req.body.image) newStory.img = req.body.image;
    newStory.save(function(err, data) {
      if (err) return res.status(500).send('there was an error');
      return res.json(data);
    });
  });

  //get a story
  app.get('/api/stories/single/:storyId', function(req, res) {
    Story.findById(req.params.storyId, function(err, story) {
      if (err) return res.status(500).send('story not found');
      return res.json(story);
    });
  });

  //update a particular story
  app.put('/api/stories/single/:storyId',
    jwtAuth,
    permissions,
    formParser,
    updateObject,
    removeImage,
  function(req, res) {
    //update the story document
    req.story.update(req.updateObj, function(err, numAffected, raw) {
      if (err) return res.status(500).send('update not successful');
      return res.json(raw);
    });
  });

  //get a story's image
  app.get('/api/stories/single/image/:storyId', function(req, res) {
    Story.findById(req.params.storyId, function(err, story) {
      if (err) res.status(500).send('story does not have an image');
      var gfs = grid(mongoose.connection.db, mongoose.mongo);
      // streaming from gridfs
      var readstream = gfs.createReadStream({
        _id: story.img
      });

      //error handling, e.g. file does not exist
      readstream.on('error', function(err) {
        console.log('An error occurred streaming the image!\n', err);
        return res.status(500).send('readstream error');
      });

      readstream.pipe(res);
    });
  });

  //get a particular user's story
  app.get('/api/stories/user', jwtAuth, function(req, res) {
    Story.find({userId: req.user._id}, function(err, stories) {
      if (err) return res.status(500).send('user has no stories');
      return res.json(stories);
    });
  });

  //get all stories within certain radius of given lat/lng
  app.get('/api/stories/location', function(req, res) {
    //query number 1 - checks for count < 200
    Story.count({
      lat: {$gt: req.headers.latmin, $lt: req.headers.latmax},
      lng: {$gt: req.headers.lngmin, $lt: req.headers.lngmax}
    }, function(err, count) {
      if (count < 200) {
        //if fewer than 200, return stories
        return Story.find({
          lat: {$gt: req.headers.latmin, $lt: req.headers.latmax},
          lng: {$gt: req.headers.lngmin, $lt: req.headers.lngmax}},
          function(err, data) {
            if (err) return res.status(500).send('database error');
            return res.json(data);
          });
      }
      //otherwise, return count
      return res.json({storyCount: count});
    });
  });
};
