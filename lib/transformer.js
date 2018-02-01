'use strict';

const sharp = require('sharp');
const includes = require('array-includes');

module.exports = transformer;

function transformer(options) {
  let imageStream = sharp();

  if (options.resize && options.size) {
    imageStream = imageStream.resize(options.size.width, options.size.height, options.size.option);
  }

  if (options.background) {
    imageStream = imageStream.background(options.background);
  }

  if (options.crop && Object.prototype.hasOwnProperty.call(sharp.gravity, options.crop)) {
    imageStream = imageStream.crop(sharp.gravity[options.crop]);
  }

  if (options.embed) {
    imageStream = imageStream.embed();
  }

  if (options.max) {
    imageStream = imageStream.max();
  }

  if (options.min) {
    imageStream = imageStream.min();
  }

  if (options.withoutEnlargement) {
    imageStream = imageStream.withoutEnlargement();
  }

  if (options.ignoreAspectRatio) {
    imageStream = imageStream.ignoreAspectRatio();
  }

  if (options.extract) {
    imageStream = imageStream.extract(options.extract);
  }

  if (options.trim) {
    imageStream = imageStream.trim(parseInt(options.trim, 10));
  }

  if (options.flatten) {
    imageStream = imageStream.flatten();
  }

  if (options.extend) {
    imageStream = imageStream.extend(options.extend);
  }

  if (options.negate) {
    imageStream = imageStream.negate();
  }

  if (includes([0, 90, 180, 270], options.rotate)) {
    imageStream = imageStream.rotate(options.rotate);
  }

  if (options.flip) {
    imageStream = imageStream.flip();
  }

  if (options.flop) {
    imageStream = imageStream.flop();
  }

  if (options.blur) {
    imageStream = imageStream.blur(options.blur);
  }

  if (options.sharpen) {
    imageStream = imageStream.sharpen(options.sharpen);
  }

  if (options.gamma) {
    imageStream = imageStream.gamma(options.gamma);
  }

  if (options.grayscale || options.greyscale) {
    imageStream = imageStream.greyscale();
  }

  if (options.normalize || options.normalise) {
    imageStream = imageStream.normalise();
  }

  if (options.convolve) {
    imageStream = imageStream.convolve(options.convolve);
  }

  if (options.threshold) {
    imageStream = imageStream.threshold(options.threshold);
  }

  if (options.toColourspace || options.toColorspace) {
    imageStream = imageStream.toColourspace(options.toColourspace || options.toColorspace);
  }

  if (options.withMetadata) {
    imageStream = imageStream.withMetadata(options.withMetadata);
  }

  if (options.format) {
    if (typeof options.format === 'object' && Object.prototype.hasOwnProperty.call(options.format, 'type') && Object.prototype.hasOwnProperty.call(options.format, 'option')) {
      imageStream = imageStream.toFormat(options.format.type, options.format.option);
    } else {
      imageStream = imageStream.toFormat(options.format);
    }
  }

  return imageStream;
}
