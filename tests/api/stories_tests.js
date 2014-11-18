'use strict';

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

  it('should clear the database stories collection', function(done) {
    mongoose.connection.collections.stories.drop(function(err) {
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
      "lat": "0.0",
      "lng": "51.0"
    })
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res.body).to.include.keys('title', 'storyBody', 'lat', 'lng', 'date', 'userId');
      tempStoryId = res.body._id;
      done();
    });
  });

  it('should return one story given a story id', function(done) {
    chai.request(url)
    .get('/api/stories/single/' + tempStoryId)
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res.body).to.include.keys('title', 'storyBody', 'lat', 'lng', 'date', 'userId');
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

  //this is for the get('/api/stories/location') route;
  //it shows that it excludes stories outside its range
  it('should add another story', function(done) {
    chai.request(url)
    .post('/api/stories')
    .set('jwt', tempJWT)
    .send({
      "title": "out of range story",
      "storyBody": "this story isn't in range",
      "lat": "100.0",
      "lng": "100.0"
    })
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res.body).to.include.keys('title', 'storyBody', 'lat', 'lng', 'date', 'userId');
      tempStoryId = res.body._id;
      done();
    });
  });

  it('should get stories inside a range of coordinates', function(done) {
    chai.request(url)
    .get('/api/stories/location')
    .set('latMin', -1)
    .set('latMax', 1)
    .set('lngMin', 50)
    .set('lngMax', 52)
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.length(1);
      done();
    });
  });
});
