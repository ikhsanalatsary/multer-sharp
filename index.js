'use strict';

const gcloud = require('@google-cloud/storage');
const Promise = require('bluebird');

const defaultOptions = require('./config/default');
const getDestination = require('./lib/get-destination');
const getFilename = require('./lib/get-filename');
const transformer = require('./lib/transformer');
const getFormat = require('./lib/get-format');
const logger = require('./lib/logger');

class MulterSharp {
  constructor(options) {
    /* eslint-disable no-param-reassign*/
    options.bucket = options.bucket || process.env.GCS_BUCKET || null;
    options.projectId = options.projectId || process.env.GCLOUD_PROJECT || null;
    options.keyFilename = options.keyFilename || process.env.GCS_KEYFILE || null;

    /* eslint-enable */
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

    this.gcStorage = gcloud({
      projectId: options.projectId,
      keyFilename: options.keyFilename
    });

    this.gcsBucket = this.gcStorage.bucket(options.bucket);
  }

  _handleFile(req, file, cb) {
    this.getDestination(req, file, (destErr, destination) => {
      if (destErr) cb(destErr);

      this.getFilename(req, file, (fileErr, filename) => {
        if (fileErr) cb(fileErr);

        const fileOptions = {
          predefinedAcl: this.options.acl,
          metadata: Object.assign(
            this.options.metadata,
            { contentType: getFormat(this.options.format) || file.mimetype }
          ),
          gzip: this.options.gzip
        };
        const gcName = typeof destination === 'string' && destination.length > 0 ? `${destination}/${filename}` : filename;
        let gcFile = this.gcsBucket.file(gcName);
        const stream = file.stream;
        let resizerStream = transformer(this.options);
        let writableStream = gcFile.createWriteStream(fileOptions);

        if (this.options.sizes && Array.isArray(this.options.sizes) && this.options.sizes.length > 0) {
          const { sizes } = this.options;

          const eachUpload = (size) => {
            const filenameWithSuffix = `${filename}-${size.suffix}`;
            const gcNameBySuffix = `${gcName}-${size.suffix}`;
            gcFile = this.gcsBucket.file(gcNameBySuffix);
            this.options.size = size;
            resizerStream = transformer(this.options);
            writableStream = gcFile.createWriteStream(fileOptions);

            return new Promise((resolve, reject) => {
              resizerStream.on('info', logger);
              resizerStream.on('error', reject);

              writableStream.on('error', reject);
              writableStream.on('finish', () => {
                const uri = encodeURI(`https://storage.googleapis.com/${this.options.bucket}/${gcNameBySuffix}`);
                resolve({
                  mimetype: getFormat(this.options.format) || file.mimetype,
                  path: uri,
                  filename: filenameWithSuffix,
                  suffix: size.suffix
                });
              });

              stream.pipe(resizerStream).pipe(writableStream);
            });
          };

          Promise
            .map(sizes, eachUpload)
            .then((results) => {
              // All resolve, do something
              const mapArrayToObject = results.reduce((acc, curr) => {
                acc[curr.suffix] = {};
                acc[curr.suffix].path = curr.path;
                acc[curr.suffix].filename = curr.filename;
                return acc;
              }, {});
              cb(null, mapArrayToObject);
              return null;
            })
            .catch(cb);
        } else {
          stream
            .pipe(resizerStream)
            .on('info', logger)
            .on('error', (transformErr) => cb(transformErr))
            .pipe(writableStream)
            .on('error', (gcErr) => cb(gcErr))
            .on('finish', () => {
              const uri = encodeURI(`https://storage.googleapis.com/${this.options.bucket}/${gcName}`);
              return cb(null, {
                mimetype: getFormat(this.options.format) || file.mimetype,
                path: uri,
                filename
              });
            });
        }
      });
    });
  }

  _removeFile(req, file, cb) {
    this.getDestination(req, file, (destErr, destination) => {
      if (destErr) cb(destErr);
      const gcName = typeof destination === 'string' && destination.length > 0 ? `${destination}/${file.filename}` : file.filename;
      const gcFile = this.gcsBucket.file(gcName);
      gcFile.delete(cb);
    });
  }
}

MulterSharp.defaultOptions = defaultOptions;

module.exports = (options) => new MulterSharp(options);
