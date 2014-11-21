'use strict';

var mongoose = require('mongoose');

var storySchema = mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  title: {type: String, required: true},
  storyBody: {type: String, required: true},
  date: Date,
  img: mongoose.Schema.Types.ObjectId,
  lat: {type: Number, required: true},
  lng: {type: Number, required: true}
});

module.exports = mongoose.model('Story', storySchema);
