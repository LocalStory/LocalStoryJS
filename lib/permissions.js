'use strict';

/*
* Make sure a user has permissions to modify the story
*
*/

var Story = require('../models/story');

module.exports = function(req, res, next) {
  Story.findById(req.params.storyId, function(err, story) {
    if (err) return res.status(500).send('story not found');
    if (String(story.userId) !== String(req.user._id)) return res.status(403).send('not authorized');
    req.story = story;
    next();
  });
};
