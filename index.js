'use strict';

const crypto = require('crypto');
const gcloud = require('google-cloud');
const sharp = require('sharp');
const includes = require('array-includes');
const { lookup } = require('mime-types');

class MulterSharp {
  constructor(options) {
    const gcOptions = {};
    gcOptions.bucket = options.bucket || process.env.GCS_BUCKET || null;
    gcOptions.projectId = options.projectId || process.env.GCLOUD_PROJECT || null;
    gcOptions.keyFilename = options.keyFilename || process.env.GCS_KEYFILE || null;

    if (!options.bucket) {
      throw new Error('You have to specify bucket for Google Cloud Storage to work.');
    }

    if (!options.projectId) {
      throw new Error('You have to specify project id for Google Cloud Storage to work.');
    }

    if (!options.keyFilename) {
      throw new Error('You have to specify credentials key file for Google Cloud Storage to work.');
    }

    this.options = Object.assign({}, MulterSharp.defaultOptions, options || {});
    this.getFilename = this.options.filename || getFilename;

    if (typeof options.destination === 'string') {
      this.getDestination = ($0, $1, cb) => cb(null, options.destination);
    } else {
      this.getDestination = options.destination || getDestination;
    }

    this.gcStorage = gcloud.storage({
      projectId: gcOptions.projectId,
      keyFilename: gcOptions.keyFilename
    });

    this.gcsBucket = this.gcStorage.bucket(gcOptions.bucket);
  }

  _handleFile(req, file, cb) {
    this.getDestination(req, file, (destErr, destination) => {
      if (destErr) cb(destErr);

      this.getFilename(req, file, (fileErr, filename) => {
        if (fileErr) cb(fileErr);

        const fileOptions = {
          predefinedAcl: this.options.acl,
          metadata: {
            contentType: lookup(this.options.format) || file.mimetype
          }
        };
        const gcName = typeof destination === 'string' && destination.length > 0 ? `${destination}/${filename}` : filename;
        const gcFile = this.gcsBucket.file(gcName);

        file.stream
          .pipe(setSharp(this.options))
          .pipe(gcFile.createWriteStream(fileOptions))
          .on('error', (streamErr) => cb(streamErr))
          .on('finish', () => {
            const uri = encodeURI(`https://storage.googleapis.com/${this.options.bucket}/${gcName}`);
            return cb(null, {
              mimetype: lookup(this.options.format) || file.mimetype,
              path: uri,
              filename
            });
          });
      });
    });
  }

  _removeFile(req, file, cb) {
    const gcFile = this.gcsBucket.file(file.filename);
    gcFile.delete(cb);
  }
}

MulterSharp.defaultOptions = {
  acl: 'private',
  getFilename,
  getDestination,
  resize: true,
  crop: false,
  background: false,
  embed: false,
  max: false,
  min: false,
  withoutEnlargement: false,
  ignoreAspectRatio: false,
  extract: false,
  trim: false,
  flatten: false,
  extend: false,
  negate: false,
  rotate: false,
  flip: false,
  flop: false,
  blur: false,
  sharpen: false,
  gamma: false,
  grayscale: false,
  greyscale: false,
  normalize: false,
  normalise: false,
  progressive: false,
  quality: false
};

function getDestination(req, file, cb) {
  cb(null, '');
}

function getFilename(req, file, cb) {
  crypto.pseudoRandomBytes(16, (err, raw) => {
    cb(err, err ? undefined : raw.toString('hex'));
  });
}

function setSharp(options) {
  let imageStream = sharp();

  switch (options) {
    case options.resize && options.size:
      imageStream = imageStream.resize(options.size.width, options.size.height);
      break;
    case options.max:
      imageStream = imageStream.max();
      break;
    case typeof options.format === 'string' && options.format.length > 0:
      imageStream = imageStream.toFormat(options.format);
      break;
    case options.embed:
      imageStream = imageStream.embed();
      break;
    case options.min:
      imageStream = imageStream.min();
      break;
    case options.ignoreAspectRatio:
      imageStream = imageStream.ignoreAspectRatio();
      break;
    case options.withoutEnlargement:
      imageStream = imageStream.withoutEnlargement();
      break;
    case options.extract:
      imageStream = imageStream.extract();
      break;
    case options.trim:
      imageStream = imageStream.trim(parseInt(options.trim, 10));
      break;
    case options.flatten:
      imageStream = imageStream.flatten();
      break;
    case options.extend:
      imageStream = imageStream.extend(options.extend);
      break;
    case options.negate:
      imageStream = imageStream.negate();
      break;
    case includes([0, 90, 180, 270], options.rotate):
      imageStream = imageStream.rotate(options.rotate);
      break;
    case options.slip:
      imageStream = imageStream.flip();
      break;
    case options.flop:
      imageStream = imageStream.flop();
      break;
    case options.blur:
      if (typeof options.blur === 'number') {
        imageStream = imageStream.blur(parseFloat(options.blur));
      } else {
        imageStream = imageStream.blur();
      }
      break;
    case options.sharpen:
      imageStream = imageStream.sharpen();
      break;
    case options.gamma:
      if (typeof options.gamma === 'number') {
        imageStream = imageStream.gamma(parseFloat(options.blur));
      } else {
        imageStream = imageStream.gamma();
      }
      break;
    case options.grayscale || options.greyscale:
      imageStream = imageStream.grayscale();
      break;
    case options.normalize || options.normalise:
      imageStream = imageStream.normalize();
      break;
    case options.quality:
      imageStream = imageStream.quality(Number(options.quality));
      break;
    case options.progressive:
      imageStream = imageStream.progressive();
      break;
    case options.crop && Object.prototype.hasOwnProperty.call(sharp.gravity, options.crop):
      imageStream = imageStream.crop(sharp.gravity[options.crop]);
      break;
    case options.background:
      imageStream = imageStream.background(options.background);
      break;
    default:
  }
  return imageStream;
}

module.exports = (options) => new MulterSharp(options);
