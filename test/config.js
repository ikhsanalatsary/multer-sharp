'use strict';

module.exports = {
  uploads: {
    gcsUpload: {
      bucket: 'multer-sharp.appspot.com', // Required : bucket name to upload
      projectId: 'multer-sharp', // Required : Google project ID
      keyFilename: 'test/firebase.auth.json', // Required : JSON credentials file for Google Cloud Storage
      destination: 'public', // Optional : destination folder to store your file for Google Cloud Storage, default: ''
      acl: 'publicRead' // Required : acl credentials file for Google Cloud Storage, publicrRead or private, default: private
    }
  }
};
