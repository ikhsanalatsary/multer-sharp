'use strict';

/* eslint-disable no-restricted-syntax, no-param-reassign */
const sharp = require('sharp');
const entries = require('object.entries');

module.exports = transformer;

function transformer(options, size) {
  let imageStream = sharp();
  for (const [key, value] of entries(options)) {
    if (value) {
      imageStream = resolveImageStream(key, value, size, imageStream);
    }
  }
  return imageStream;
}

const objectHasOwnProperty = (source, prop) => Object.prototype.hasOwnProperty.call(source, prop);
const hasProp = (value) => typeof value === 'object' && objectHasOwnProperty(value, 'type');
const isObject = (obj) => typeof obj === 'object' && obj !== null;
const validateFormat = (value) => {
  if (hasProp(value)) {
    return value.type;
  }
  return value;
};
// const validateValue = (value) => {
//   if (typeof value === 'boolean') {
//     return null;
//   }
//   return value;
// };
const resolveImageStream = (key, value, size, imageStream) => {
  switch (key) {
    case 'resize':
      if (isObject(size)) {
        imageStream = imageStream.resize(size.width, size.height, size.option);
      }
      break;
    case 'linear':
      imageStream = imageStream.linear(value.a, value.b);
      break;
    case 'boolean':
      imageStream = imageStream.boolean(value.operand, value.operator, value.options);
      break;
    case 'joinChannel':
      imageStream = imageStream.joinChannel(value.images, value.options);
      break;
    case 'toFormat':
      imageStream = imageStream.toFormat(validateFormat(value), value.options);
      break;

    default: {
      // const valid = validateValue(value);
      imageStream = imageStream[key](value);
      break;
    }
  }

  return imageStream;
};
