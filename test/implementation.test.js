'use strict';

const express = require('express');
const supertest = require('supertest');
const multer = require('multer');
const chai = require('chai');

const multerSharp = require('../index');
const config = require('./config');

const app = express();
const should = chai.should();
let lastRes = null;
let lastReq = lastRes;
const storage = multerSharp({
  bucket: config.uploads.gcsUpload.bucket,
  projectId: config.uploads.gcsUpload.projectId,
  keyFilename: config.uploads.gcsUpload.keyFilename,
  acl: config.uploads.gcsUpload.acl,
  size: {
    width: 400,
    height: 400
  },
  max: true
});
const upload = multer({ storage });
const storage2 = multerSharp({
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-newFilename`);
  },
  bucket: config.uploads.gcsUpload.bucket,
  projectId: config.uploads.gcsUpload.projectId,
  keyFilename: config.uploads.gcsUpload.keyFilename,
  acl: config.uploads.gcsUpload.acl,
  size: {
    width: 400,
    height: 400
  },
  max: true
});
const upload2 = multer({ storage: storage2 });

const storage3 = multerSharp({
  bucket: config.uploads.gcsUpload.bucket,
  projectId: config.uploads.gcsUpload.projectId,
  keyFilename: config.uploads.gcsUpload.keyFilename,
  acl: config.uploads.gcsUpload.acl,
  destination: config.uploads.gcsUpload.destination,
  size: {
    width: 400,
    height: 400
  },
  max: true
});
const upload3 = multer({ storage: storage3 });

const storage4 = multerSharp({
  bucket: config.uploads.gcsUpload.bucket,
  projectId: config.uploads.gcsUpload.projectId,
  keyFilename: config.uploads.gcsUpload.keyFilename,
  acl: config.uploads.gcsUpload.acl,
  destination: config.uploads.gcsUpload.destination,
  size: {
    width: 400,
    height: 400
  },
  max: true,
  format: 'jpeg'
});
const upload4 = multer({ storage: storage4 });

// express setup
app.get('/book', (req, res) => {
  res.sendStatus(200);
});

// express setup
app.post('/upload', upload.single('myPic'), (req, res, next) => {
  lastReq = req;
  lastRes = res;
  res.sendStatus(200);
  next();
});

// // express setup
app.post('/uploadwithfilename', upload2.single('myPic'), (req, res, next) => {
  lastReq = req;
  lastRes = res;
  res.sendStatus(200);
  next();
});

// express setup
app.post('/uploadwithdestination', upload3.single('myPic'), (req, res, next) => {
  lastReq = req;
  lastRes = res;
  res.sendStatus(200);
  next();
});

// express setup
app.post('/uploadconverttojpeg', upload4.single('myPic'), (req, res, next) => {
  lastReq = req;
  lastRes = res;
  res.sendStatus(200);
  next();
});

// Run Test
describe('express', () => {
  it('initial server', (done) => {
    supertest(app)
      .get('/book')
      .end((err, res) => {
        res.status.should.to.equal(200);
        done();
      });
  });
  it('successfully uploads a file', (done) => {
    supertest(app)
      .post('/upload')
      .attach('myPic', 'test/nodejs-512.png')
      .expect(200, done);
  });
  it('returns a req.file with the Google Cloud Storage filename and location', (done) => {
    supertest(app)
      .post('/upload')
      .attach('myPic', 'test/nodejs-512.png')
      .end(() => {
        const file = lastReq.file;
        file.should.have.property('path');
        file.should.have.property('filename');
        file.should.have.property('fieldname');
        file.should.have.property('encoding');
        file.should.have.property('mimetype');
        file.should.have.property('originalname');
        file.fieldname.should.have.string('myPic');
        file.path.should.have.string('googleapis');
        done();
      });
  });
  it('return a req.file with the optional filename', (done) => {
    supertest(app)
      .post('/uploadwithfilename')
      .attach('myPic', 'test/nodejs-512.png')
      .end(() => {
        const file = lastReq.file;
        file.should.have.property('path');
        file.should.have.property('filename');
        file.should.have.property('fieldname');
        file.should.have.property('encoding');
        file.should.have.property('mimetype');
        file.should.have.property('originalname');
        file.fieldname.should.have.string('myPic');
        file.filename.should.to.equal('myPic-newFilename');
        file.path.should.have.string('googleapis');
        done();
      });
  });
  it('return a req.file with the optional destination', (done) => {
    supertest(app)
      .post('/uploadwithdestination')
      .attach('myPic', 'test/nodejs-512.png')
      .end(() => {
        const file = lastReq.file;
        file.should.have.property('path');
        file.should.have.property('filename');
        file.should.have.property('fieldname');
        file.should.have.property('encoding');
        file.should.have.property('mimetype');
        file.should.have.property('originalname');
        file.fieldname.should.have.string('myPic');
        file.path.should.have.string(config.uploads.gcsUpload.destination);
        file.path.should.have.string('googleapis');
        done();
      });
  });
  it('return a req.file with mimetype image/jpeg', (done) => {
    supertest(app)
      .post('/uploadconverttojpeg')
      .attach('myPic', 'test/nodejs-512.png')
      .end(() => {
        const file = lastReq.file;
        file.should.have.property('path');
        file.should.have.property('filename');
        file.should.have.property('fieldname');
        file.should.have.property('encoding');
        file.should.have.property('mimetype');
        file.should.have.property('originalname');
        file.fieldname.should.have.string('myPic');
        file.mimetype.should.have.string('image/jpeg');
        file.path.should.have.string(config.uploads.gcsUpload.destination);
        file.path.should.have.string('googleapis');
        done();
      });
  });
});
