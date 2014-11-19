'use strict';

var mongoose = require('mongoose');

var storySchema = mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  title: String,
  storyBody: String,
  date: Date,
  img: mongoose.Schema.Types.ObjectId,
  lat: Number,
  lng: Number
});

module.exports = mongoose.model('Story', storySchema);
