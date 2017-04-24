'use strict';

const express = require('express');
const supertest = require('supertest');
const multer = require('multer');
const chai = require('chai');

const expect = chai.expect;
const multerSharp = require('../index');
const config = require('./config');

const app = express();
const should = chai.should(); // eslint-disable-line no-unused-vars
let lastRes = null;
let lastReq = lastRes;
const storage = multerSharp({
  bucket: config.uploads.gcsUpload.bucket,
  projectId: config.uploads.gcsUpload.projectId,
  keyFilename: config.uploads.gcsUpload.keyFilename,
  acl: config.uploads.gcsUpload.acl,
  size: {
    width: 400,
    height: 400,
    option: {
      kernel: 'lanczos2',
      interpolator: 'nohalo'
    }
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
  size: { width: 200 },
  crop: 'north',
  background: { r: 0, g: 0, b: 100, alpha: 0 },
  withoutEnlargement: true,
  ignoreAspectRatio: true,
  trim: 50,
  flatten: true,
  extend: { top: 10, bottom: 20, left: 10, right: 10 },
  negate: true,
  rotate: 90,
  flip: true,
  flop: true,
  blur: true,
  sharpen: true,
  gamma: 2.5,
  greyscale: true,
  normalize: true,
  format: {
    type: 'jpeg',
    option: {
      progressive: true,
      quality: 90
    }
  }
});
const upload4 = multer({ storage: storage4 });

const storage5 = multerSharp({
  bucket: config.uploads.gcsUpload.bucket,
  projectId: config.uploads.gcsUpload.projectId,
  keyFilename: config.uploads.gcsUpload.keyFilename,
  acl: config.uploads.gcsUpload.acl,
  destination: config.uploads.gcsUpload.destination,
  size: { width: 400, height: 400 },
  crop: 'north',
  background: { r: 0, g: 0, b: 0, alpha: 0 },
  embed: true,
  max: true,
  min: true,
  withoutEnlargement: true,
  ignoreAspectRatio: true,
  extract: { left: 0, top: 2, width: 50, height: 100 },
  trim: 50,
  flatten: true,
  extend: { top: 10, bottom: 20, left: 10, right: 10 },
  negate: true,
  rotate: 90,
  flip: true,
  flop: true,
  blur: true,
  sharpen: true,
  gamma: 2.5,
  grayscale: true,
  normalise: true,
  format: 'jpeg'
});
const upload5 = multer({ storage: storage5 });

const storage6 = multerSharp({
  bucket: config.uploads.gcsUpload.bucket,
  projectId: config.uploads.gcsUpload.projectId,
  keyFilename: config.uploads.gcsUpload.keyFilename,
  acl: config.uploads.gcsUpload.acl,
  size: {
    width: 400,
    height: 400
  },
  max: true,
  extract: { left: 0, top: 2, width: 400, height: 400 }
});
const upload6 = multer({ storage: storage6 });

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

// express setup
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

// express setup
app.post('/uploadanddelete', upload5.single('myPic'), (req, res, next) => {
  storage5._removeFile(req, req.file, (err) => { // eslint-disable-line no-underscore-dangle
    if (err) next(err);
    res.sendStatus(200);
    next();
  });
});

app.post('/uploadwithtransformerror', (req, res) => {
  const uploadAndError = upload6.single('myPic');
  uploadAndError(req, res, (uploadError) => {
    if (uploadError) {
      res.status(400).json({ message: 'Something went wrong when resize' });
    }
  });
});

// Run Test
describe('express', function describe() {
  this.timeout(15000);
  it('initial server', (done) => {
    supertest(app)
      .get('/book')
      .end((err, res) => {
        res.status.should.to.equal(200);
        done();
      });
  });
  it('successfully uploads a file', (done) => {
    setTimeout(done, 10000);
    supertest(app)
      .post('/upload')
      .attach('myPic', 'test/nodejs-512.png')
      .expect(200);
  });
  it('returns a req.file with the Google Cloud Storage filename and path', (done) => {
    setTimeout(done, 10000);
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
      });
  });
  it('return a req.file with the optional filename', (done) => {
    setTimeout(done, 10000);
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
      });
  });
  it('return a req.file with the optional destination', (done) => {
    setTimeout(done, 10000);
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
      });
  });
  it('return a req.file with mimetype image/jpeg', (done) => {
    setTimeout(done, 10000);
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
      });
  });
  it('upload and delete after', (done) => {
    setTimeout(done, 10000);
    supertest(app)
      .post('/uploadanddelete')
      .attach('myPic', 'test/nodejs-512.png')
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        res.status.should.to.equal(200);
      });
  });
  it('upload and return error, cause transform/resize error', (done) => {
    setTimeout(done, 10000);
    supertest(app)
      .post('/uploadwithtransformerror')
      .attach('myPic', 'test/nodejs-512.png')
      .end((err, res) => {
        res.status.should.to.equal(400);
        res.body.message.should.to.equal('Something went wrong when resize');
      });
  });
});

describe('Multer-Sharp', () => {
  it('should throw an error, cause bucket is not specify', (done) => {
    expect(multerSharp.bind(multerSharp, {
      projectId: config.uploads.gcsUpload.projectId,
      keyFilename: config.uploads.gcsUpload.keyFilename
    })).to.throw('You have to specify bucket for Google Cloud Storage to work.');
    done();
  });
  it('should throw an error, cause projectId is not specify', (done) => {
    expect(multerSharp.bind(multerSharp, {
      bucket: config.uploads.gcsUpload.bucket,
      keyFilename: config.uploads.gcsUpload.keyFilename
    })).to.throw('You have to specify project id for Google Cloud Storage to work.');
    done();
  });
  it('should throw an error, cause keyFilename is not specify', (done) => {
    expect(multerSharp.bind(multerSharp, {
      bucket: config.uploads.gcsUpload.bucket,
      projectId: config.uploads.gcsUpload.projectId
    })).to.throw('You have to specify credentials key file for Google Cloud Storage to work.');
    done();
  });
});
