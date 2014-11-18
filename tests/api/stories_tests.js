'use strict';

var fs = require('fs');
var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var expect = chai.expect;
var url = 'http://localhost:3000';

chai.use(chaiHttp);

require('../../server');

describe('stories', function() {
  it('should clear the database users collection', function(done) {
    mongoose.connection.collections.users.drop(function(err) {
      if (err) { console.log(err); }
      done();
    });
  });

  var tempJWT;
  var tempStoryId;

  it('should create a new user', function(done) {
    chai.request(url)
    .post('/api/users')
    .send({"email": "test@example.com", "password": "asdf", "passwordConfirm": "asdf"})
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res.body).to.have.property('jwt').that.is.a('string');
      tempJWT = res.body.jwt;
      done();
    });
  });

  it('should add a story', function(done) {
    chai.request(url)
    .post('/api/stories')
    .set('jwt', tempJWT)
    .send({
      "title": "my cool title",
      "storyBody": "the body of the story",
      "lat": "24.54654",
      "lng": "54.4645"
    })
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res).to.not.have.status(500);
      expect(res.body).to.include.keys('title', 'storyBody', 'location', 'date', 'userId');
      tempStoryId = res.body._id;
      done();
    });
  });

  it('should return one story given a story id', function(done) {
    chai.request(url)
    .get('/api/stories/single/' + tempStoryId)
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res.body).to.include.keys('title', 'storyBody', 'location', 'date', 'userId');
      done();
    });
  });

  it('should get a user\'s stories', function(done) {
    chai.request(url)
    .get('/api/stories/user')
    .set('jwt', tempJWT)
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res.body).to.be.an('array');
      done();
    });
  });

  var imageBuffer = fs.readFileSync('/Users/Gabe/Desktop/DSCN0119.JPG');
  //var imageBuffer = fs.readFileSync('/Users/Gabe/Desktop/WindowsLicensing.txt');

  it('should add an image to a story', function(done) {
    chai.request(url)
    .post('/api/story/image')
    .send({"image": imageBuffer, "imageName": "imagename"})
    .end(function(err, res) {
      expect(err).to.be.null;
      done();
    });
  });
});
