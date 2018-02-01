'use strict';

const crypto = require('crypto');

module.exports = (req, file, cb) => {
  crypto.pseudoRandomBytes(16, (err, raw) => {
    cb(err, err ? undefined : raw.toString('hex'));
  });
};
