'use strict';

var through = require('through');
var Grid = require('gridfs-stream');

module.exports = function(db, driver) {
  return function(req, res, next) {
    //if no image was attached, continue on
    if (!req.body.image) return next();

    var gfs = Grid(db, driver);
    var writeStream = gfs.createWriteStream({
      filename: req.body.imageName
    });

    /*var tr = through(function write(data) {
      console.log(data);
      this.queue(data.body.image);
    }, function end() {
      this.queue(null);
    });*/


    //pipe readstream into gfs write stream
    writeStream.end(new Buffer(req.body.image));

    writeStream.on('close', function(data) {
      req.image = data._id;
      next();
    });
  };
};
