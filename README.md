# Multer-Sharp

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/591acfd486004229adb02e47074d4d73)](https://app.codacy.com/app/ikhsanalatsary/multer-sharp?utm_source=github.com&utm_medium=referral&utm_content=ikhsanalatsary/multer-sharp&utm_campaign=badger)
[ ![Codeship Status for ikhsanalatsary/multer-sharp](https://app.codeship.com/projects/aa56e710-0a47-0135-8b3c-6ed4d7e33e57/status?branch=master)](https://app.codeship.com/projects/214729) [![Build Status](https://travis-ci.org/ikhsanalatsary/multer-sharp.svg?branch=master)](https://travis-ci.org/ikhsanalatsary/multer-sharp) [![Code Climate](https://codeclimate.com/github/ikhsanalatsary/multer-sharp/badges/gpa.svg)](https://codeclimate.com/github/ikhsanalatsary/multer-sharp) [![codecov.io](https://codecov.io/gh/ikhsanalatsary/multer-sharp/coverage.svg?branch=master)](https://codecov.io/gh/ikhsanalatsary/multer-sharp?branch=master) [![Depedencies Status](https://david-dm.org/ikhsanalatsary/multer-sharp.svg)](https://david-dm.org/ikhsanalatsary/multer-sharp) [![devDepedencies Status](https://david-dm.org/ikhsanalatsary/multer-sharp/dev-status.svg)](https://david-dm.org/ikhsanalatsary/multer-sharp?type=dev)
[![npm](https://img.shields.io/npm/dm/multer-sharp.svg)]() [![Greenkeeper badge](https://badges.greenkeeper.io/ikhsanalatsary/multer-sharp.svg)](https://greenkeeper.io/)

***

Multer Sharp is streaming multer storage engine permit to resize and upload to Google Cloud Storage.

This project is mostly an integration piece for existing code samples from Multer's [storage engine documentation](https://github.com/expressjs/multer/blob/master/StorageEngine.md). With add-ons include [google-cloud](https://github.com/googlecloudplatform/google-cloud-node) and [sharp](https://github.com/lovell/sharp)

# Requirement:

  node v6 LTS version or latest version

# Installation

npm:

	npm install --save multer-sharp

yarn:

	yarn add multer-sharp

# Tests

```
npm test
```

# Usage

```javascript
const express = require('express');
const multer = require('multer');
const gcsSharp = require('multer-sharp');

const app = express();

// without resize image
const storage = gcsSharp({
    bucket: 'YOUR_BUCKET', // Required : bucket name to upload
    projectId: 'YOUR_PROJECTID', // Required : Google project ID
    keyFilename: 'YOUR_KEYFILENAME', // Optional : JSON credentials file for Google Cloud Storage
    destination: 'public/image', // Optional : destination folder to store your file on Google Cloud Storage, default: ''
    acl: 'publicRead' // Optional : acl credentials file for Google Cloud Storage, 'publicrRead' or 'private', default: 'private'
});
const upload = multer({ storage });

app.post('/upload', upload.single('myPic'), (req, res) => {
    console.log(req.file); // Print upload details
    res.send('Successfully uploaded!');
});

// or

// simple resize with custom filename
const storage2 = gcsSharp({
  filename: (req, file, cb) => {
      cb(null, `${file.fieldname}-newFilename`);
  },
  bucket: 'YOUR_BUCKET', // Required : bucket name to upload
  projectId: 'YOUR_PROJECTID', // Required : Google project ID
  keyFilename: 'YOUR_KEYFILENAME', // Optional : JSON credentials file for Google Cloud Storage
  acl: 'publicRead', // Optional : acl credentials file for Google Cloud Storage, 'publicrRead' or 'private', default: 'private'
  size: {
    width: 400,
    height: 400
  },
  max: true
});
const upload2 = multer({ storage: storage2 });

app.post('/uploadwithfilename', upload2.single('myPic'), (req, res, next) => {
    console.log(req.file); // Print upload details
    res.send('Successfully uploaded!');
});

/* If you need generate image with specific size
 * simply to adding `sizes` property
 * sizes must be an `array` and must be specify
 * with suffix, width / height property
 */
const storage = multerSharp({
  bucket: config.uploads.gcsUpload.bucket,
  projectId: config.uploads.gcsUpload.projectId,
  keyFilename: config.uploads.gcsUpload.keyFilename,
  acl: config.uploads.gcsUpload.acl,
  sizes: [
    { suffix: 'xlg', width: 1200, height: 1200 },
    { suffix: 'lg', width: 800, height: 800 },
    { suffix: 'md', width: 500, height: 500 },
    { suffix: 'sm', width: 300, height: 300 },
    { suffix: 'xs', width: 100 }
  ],
  max: true
});
const upload = multer({ storage });

app.post('/uploadmultiplesize', upload.single('myPic'), (req, res, next) => {
    console.log(req.file);
    /*
    * will print like this
    {
      originalname: 'nodejs-512.png',
      encoding: '7bit',
      mimetype: 'image/png',
      md: {
        path: 'https://storage.googleapis.com/multer-sharp.appspot.com/cd2105f5d60684a9f7c9fd2c340befed-md',
        filename: 'cd2105f5d60684a9f7c9fd2c340befed-md'
      },
      sm: {
        path: 'https://storage.googleapis.com/multer-sharp.appspot.com/cd2105f5d60684a9f7c9fd2c340befed-sm',
        filename: 'cd2105f5d60684a9f7c9fd2c340befed-sm'
      },
      xs: {
        path: 'https://storage.googleapis.com/multer-sharp.appspot.com/cd2105f5d60684a9f7c9fd2c340befed-xs',
        filename: 'cd2105f5d60684a9f7c9fd2c340befed-xs'
      }
    }
    */
    res.send('Successfully uploaded!');
});

```

for more example you can see [here](https://github.com/ikhsanalatsary/multer-sharp/blob/master/test/implementation.test.js)

# Options
```javascript
const storage = gcsSharp(options);
```

#### Multer-Sharp options
| option | default | role |
| ------ | ------- | ---- |
| filename | randomString | your output filename |
| bucket | no | Required your bucket name on Google Cloud Storage to upload. Environment variable - GCS_BUCKET |
| projectId | no | Required your project id on Google Cloud Storage to upload. Environment variable - GC_PROJECT |
| keyFilename | no | JSON credentials file for Google Cloud Storage. Environment variable - GCS_KEYFILE or [default google cloud credentials](https://cloud.google.com/docs/authentication/production) |
| acl | 'private' | Required acl credentials file for Google Cloud Storage, value: `publicRead` or `private`, doc: https://cloud.google.com/storage/docs/access-control/lists |
| gzip | no | @param {boolean} [options.gzip] Automatically gzip the file. This will set `options.metadata.contentEncoding` to `gzip`. |
| metadata | no | @param {object} additional metadata |
| destination | emptyString | Optional, destination folder to store your file on Google Cloud Storage |
| size | no | size specification `object` for output image, as follow: `{ width: 300, height: 200, option: {[...resizeOptions]} }` property `height` & `option` is optional. doc: [sharpResizeOptions](http://sharp.dimens.io/en/stable/api-resize/#resize) |
| sizes | no | an Array of size specification `object` for output image and specify diff size with suffix, as follow: `{ suffix: 'md', width: 300, height: 200, option: {[...resizeOptions]} }` property `height` & `option` is optional. doc: [sharpResizeOptions](http://sharp.dimens.io/en/stable/api-resize/#resize) |

#### sharp options
Please visit this **[sharp](https://github.com/lovell/sharp)** for detailed overview of specific option.

multer-sharp embraces sharp option, as table below:

| option | default | role |
| ------ | ------- | ---- |
| resize | true | resize images as per their size mentioned in `options.size` |
| crop | false | crop image |
| background | false | set the background for the embed, flatten and extend operations. |
| embed | false | embed on canvas |
| max | false | set maximum output dimension  |
| min | false | set minimum output dimension |
| withoutEnlargement | false | do not enlarge small images |
| ignoreAspectRatio | false | ignore aspect ration while resizing images |
| extract | false | extract specific part of image |
| trim | false | Trim **boring** pixels from all edges |
| flatten | false | Merge alpha transparency channel, if any, with background. |
| extend | false | Extends/pads the edges of the image with background. |
| negate | false | Produces the **negative** of the image. |
| rotate | false | Rotate the output image by either an explicit angle |
| flip | false | Flip the image about the vertical Y axis. |
| flop | false | Flop the image about the horizontal X axis. |
| blur | false | Mild blur of the output image |
| sharpen | false | Mild sharpen of the output image |
| gamma | false | Apply a gamma correction. |
| grayscale *or* greyscale | false | Convert to 8-bit greyscale; 256 shades of grey. |
| normalize *or* normalise | false | Enhance output image contrast by stretching its luminance to cover the full dynamic range. |
| withMetadata | false | Include all metadata (EXIF, XMP, IPTC) from the input image in the output image.
| convolve | false | Convolve the image with the specified kernel.
| threshold | false | Any pixel value greather than or equal to the threshold value will be set to 255, otherwise it will be set to 0
| toColourspace *or* toColorspace | false | Set the output colourspace. By default output image will be web-friendly sRGB, with additional channels interpreted as alpha channels.
| toFormat | false | type of output file to produce. valid value : `'jpeg'`, `'png'`, `'magick'`, `'webp'`, `'tiff'`, `'openslide'`, `'dz'`, `'ppm'`, `'fits'`, `'gif'`, `'svg'`, `'pdf'`, `'v'`, `'raw'` or `object`. if `object` specify as follow: `{ type: 'png', options: { [...toFormatOptions] } }` doc: [sharpToFormat](http://sharp.dimens.io/en/stable/api-output/#toformat)|
***

## License
[MIT](http://opensource.org/licenses/MIT)
Copyright (c) 2017 - forever [Abdul Fattah Ikhsan](https://twitter.com/abdfattahikhsan)
