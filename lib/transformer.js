'use strict';

const sharp = require('sharp');
const includes = require('array-includes');

module.exports = transformer;

function transformer({
  resize,
  size,
  background,
  crop,
  embed,
  max,
  min,
  withoutEnlargement,
  ignoreAspectRatio,
  extract,
  trim,
  flatten,
  extend,
  negate,
  rotate,
  flip,
  flop,
  blur,
  sharpen,
  gamma,
  grayscale,
  greyscale,
  normalize,
  normalise,
  convolve,
  threshold,
  toColourspace,
  toColorspace,
  withMetadata,
  format
}) {
  let imageStream = sharp();
  const objectHasOwnProperty = Object.prototype.hasOwnProperty;
  const hasTypeAndOption = typeof format === 'object' &&
    objectHasOwnProperty.call(format, 'type') &&
    objectHasOwnProperty.call(format, 'option');

  if (resize && size) {
    imageStream = imageStream.resize(size.width, size.height, size.option);
  }

  if (background) {
    imageStream = imageStream.background(background);
  }

  if (crop && objectHasOwnProperty.call(sharp.gravity, crop)) {
    imageStream = imageStream.crop(sharp.gravity[crop]);
  }

  if (embed) {
    imageStream = imageStream.embed();
  }

  if (max) {
    imageStream = imageStream.max();
  }

  if (min) {
    imageStream = imageStream.min();
  }

  if (withoutEnlargement) {
    imageStream = imageStream.withoutEnlargement();
  }

  if (ignoreAspectRatio) {
    imageStream = imageStream.ignoreAspectRatio();
  }

  if (extract) {
    imageStream = imageStream.extract(extract);
  }

  if (trim) {
    imageStream = imageStream.trim(parseInt(trim, 10));
  }

  if (flatten) {
    imageStream = imageStream.flatten();
  }

  if (extend) {
    imageStream = imageStream.extend(extend);
  }

  if (negate) {
    imageStream = imageStream.negate();
  }

  if (includes([0, 90, 180, 270], rotate)) {
    imageStream = imageStream.rotate(rotate);
  }

  if (flip) {
    imageStream = imageStream.flip();
  }

  if (flop) {
    imageStream = imageStream.flop();
  }

  if (blur) {
    imageStream = imageStream.blur(blur);
  }

  if (sharpen) {
    imageStream = imageStream.sharpen(sharpen);
  }

  if (gamma) {
    imageStream = imageStream.gamma(gamma);
  }

  if (grayscale || greyscale) {
    imageStream = imageStream.greyscale();
  }

  if (normalize || normalise) {
    imageStream = imageStream.normalise();
  }

  if (convolve) {
    imageStream = imageStream.convolve(convolve);
  }

  if (threshold) {
    imageStream = imageStream.threshold(threshold);
  }

  if (toColourspace || toColorspace) {
    imageStream = imageStream.toColourspace(toColourspace || toColorspace);
  }

  if (withMetadata) {
    imageStream = imageStream.withMetadata(withMetadata);
  }

  if (format) {
    if (hasTypeAndOption) {
      imageStream = imageStream.toFormat(format.type, format.option);
    } else {
      imageStream = imageStream.toFormat(format);
    }
  }

  return imageStream;
}
