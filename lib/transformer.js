'use strict';

/* eslint-disable no-restricted-syntax */
const sharp = require('sharp');
const includes = require('array-includes');
const entries = require('object.entries');

module.exports = transformer;

function transformer(options, size) {
  let imageStream = sharp();
  for (const [key, value] of entries(options)) {
    if (value) {
      if (key === 'resize' && typeof size === 'object') {
        imageStream = imageStream.resize(size.width, size.height, size.option);
      } else if (key === 'crop') {
        if (objectHasOwnProperty(sharp.gravity, value)) {
          imageStream = imageStream.crop(sharp.gravity[value]);
        }
      } else if (key === 'trim') {
        imageStream = imageStream.trim(parseInt(value, 10));
      } else if (key === 'rotate' && includes([0, 90, 180, 270], value)) {
        imageStream = imageStream.rotate(value);
      } else if (key === 'toFormat') {
        imageStream = imageStream.toFormat(hasProp(value) ? value.type : value, value.options);
      } else {
        const checkValue = typeof value === 'boolean' ? null : value;
        imageStream = imageStream[key](checkValue);
      }
    }
  }
  return imageStream;
}

const hasProp = (value) => typeof value === 'object' &&
    objectHasOwnProperty(value, 'type') &&
    objectHasOwnProperty(value, 'options');

const objectHasOwnProperty = (source, prop) => Object.prototype.hasOwnProperty.call(source, prop);
