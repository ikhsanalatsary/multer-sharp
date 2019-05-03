'use strict';

module.exports = (options) => ({
  resize: options.resize,
  toFormat: options.toFormat,
  extract: options.extract,
  trim: options.trim,
  flatten: options.flatten,
  extend: options.extend,
  negate: options.negate,
  rotate: options.rotate,
  flip: options.flip,
  flop: options.flop,
  blur: options.blur,
  sharpen: options.sharpen,
  gamma: options.gamma,
  grayscale: options.grayscale,
  greyscale: options.greyscale,
  normalize: options.normalize,
  normalise: options.normalise,
  convolve: options.convolve,
  threshold: options.threshold,
  toColourspace: options.toColourspace,
  toColorspace: options.toColorspace,
  withMetadata: options.withMetadata,
  composite: options.composite,
  ensureAlpha: options.ensureAlpha,
  modulate: options.modulate
});
