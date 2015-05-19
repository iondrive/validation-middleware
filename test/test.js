var assert = require('assert');

var bodyParser = require('body-parser');
var express = require('express');
var request = require('@iondrive/supertest');

var validator = require('../');

validator.addFormat('only-a', /^a+$/);
validator.addFormat('abc', /abc/);

validator.addSchema('nickname', {
  type: 'string',
  pattern: /^[a-z]{2,8}$/
});

describe('validator-middleware', function () {

  describe('body', function () {
    var app = express();
    app.use(bodyParser.json());

    app.post('/',
      validator.body({
        type: 'object',
        properties: {
          name: {
            type: 'string'
          },
          age: {
            type: 'number'
          }
        },
        required: ['name']
      }),
      function (req, res) {
        res.end(req.body.name + ':' + req.body.age);
      }
    );

    it('should accept valid body', function (done) {
      request(app)
      .post('/')
      .send({ name: 'alice', age: 30 })
      .expect(200, 'alice:30', done);
    });

    it('should error on missing body', function (done) {
      request(app)
      .post('/')
      .expect(400, function (err, res) {
        assert.equal(res.body.errors[0].field, 'name');
        assert.equal(res.body.errors[0].message, 'is required');
        done();
      });
    });

    it('should error on wrong type', function (done) {
      request(app)
      .post('/')
      .send({ name: 123 })
      .expect(400, function (err, res) {
        assert.equal(res.body.errors[0].field, 'name');
        assert.equal(res.body.errors[0].message, 'is the wrong type');
        done();
      });
    });

    it('should report multiple errors', function (done) {
      request(app)
      .post('/')
      .send({ age: 'alice' })
      .expect(400, function (err, res) {
        assert.equal(res.body.errors[0].field, 'name');
        assert.equal(res.body.errors[0].message, 'is required');
        assert.equal(res.body.errors[1].field, 'age');
        assert.equal(res.body.errors[1].message, 'is the wrong type');
        done();
      });
    });
  });

  describe('query', function () {
    var app = express();

    app.get('/',
      validator.query({
        type: 'object',
        properties: {
          name: {
            type: 'string'
          },
          age: {
            type: 'string'
          }
        },
        required: ['name']
      }),
      function (req, res) {
        res.end(req.query.name + ':' + req.query.age);
      }
    );

    it('should accept valid query', function (done) {
      request(app)
      .get('/?name=alice&age=30')
      .expect(200, 'alice:30', done);
    });

    it('should error on missing query', function (done) {
      request(app)
      .get('/')
      .expect(400, function (err, res) {
        assert.equal(res.body.errors[0].field, 'name');
        assert.equal(res.body.errors[0].message, 'is required');
        done();
      });
    });
  });

  describe('params', function () {
    var app = express();

    app.get('/:name/:age',
      validator.params({
        type: 'object',
        properties: {
          name: {
            type: 'string'
          },
          age: {
            type: 'string',
            pattern: /^[0-9]{1,3}$/
          }
        },
        required: ['name']
      }),
      function (req, res) {
        res.end(req.params.name + ':' + req.params.age);
      }
    );

    it('should accept valid params', function (done) {
      request(app)
      .get('/alice/30')
      .expect(200, 'alice:30', done);
    });

    it('should error on invald params', function (done) {
      request(app)
      .get('/alice/hello')
      .expect(400, function (err, res) {
        assert.equal(res.body.errors[0].field, 'age');
        assert.equal(res.body.errors[0].message, 'pattern mismatch');
        done();
      });
    });
  });

  describe('custom format', function () {
    var app = express();
    app.use(bodyParser.json());

    app.post('/',
      validator.body({
        type: 'object',
        properties: {
          a: {
            type: 'string',
            format: 'only-a'
          },
          abc: {
            type: 'string',
            format: 'abc'
          }
        }
      }),
      function (req, res) {
        res.end(req.body.a + ':' + req.body.abc);
      }
    );

    it('should accept valid body', function (done) {
      request(app)
      .post('/')
      .send({ a: 'aaaaa', abc: 'abc' })
      .expect(200, 'aaaaa:abc', done);
    });

    it('should error on invald body', function (done) {
      request(app)
      .post('/')
      .send({ a: 'bbbbb', abc: 'cba' })
      .expect(400, function (err, res) {
        assert.equal(res.body.errors[0].field, 'a');
        assert.equal(res.body.errors[0].message, 'must be only-a format');
        assert.equal(res.body.errors[1].field, 'abc');
        assert.equal(res.body.errors[1].message, 'must be abc format');
        done();
      });
    });
  });

  describe('custom schema', function () {
    var app = express();
    app.use(bodyParser.json());

    app.post('/',
      validator.body({
        type: 'object',
        properties: {
          nickname: {
            $ref: '#nickname'
          }
        }
      }),
      function (req, res) {
        res.end(req.body.nickname);
      }
    );

    it('should accept valid body', function (done) {
      request(app)
      .post('/')
      .send({ nickname: 'al' })
      .expect(200, 'al', done);
    });

    it('should error on invald body', function (done) {
      request(app)
      .post('/')
      .send({ nickname: 'thisistoolong' })
      .expect(400, function (err, res) {
        assert.equal(res.body.errors[0].field, 'nickname');
        assert.equal(res.body.errors[0].message, 'referenced schema does not match');
        done();
      });
    });
  });
});
