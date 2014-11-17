'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var expect = chai.expect;

var url = 'http://localhost:3000';
var jwt = require('jwt-simple');
var app = require('../../server');

chai.use(chaiHttp);

mongoose.connection.collections['users'].drop(function(err) {
  if (err) {
    console.log(err);
    return;
  }
});

describe('users', function() {
  var jwt;

  it('should create a new user', function(done) {
    chai.request(url)
    .post('/api/users')
    .send({"email": "test@example.com", "password": "asdf", "passwordConfirm": "asdf"})
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res.body).to.have.property('jwt').that.is.a('string');
      done();
    });
  });

  it('should sign a user in', function(done) {
    chai.request(url)
    .get('/api/users')
    .auth('test@example.com', 'asdf')
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res.body).to.have.property('jwt').that.is.a('string');
      jwt = res.body.jwt;
      done();
    });
  });
});
