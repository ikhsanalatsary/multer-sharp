'use strict';

const { lookup } = require('mime-types');

module.exports = (format) => {
  if (typeof format === 'object' && Object.prototype.hasOwnProperty.call(format, 'type')) {
    return lookup(format.type);
  }
  return lookup(format);
};
