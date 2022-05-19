const fs = require('fs');
const path  = require('path');

function copyDir() {

  fs.readdir(path.resolve(__dirname, 'files-copy'), (err, items) => {
    if(err) {
      fs.mkdir(path.resolve(__dirname, 'files-copy'), { recursive: true }, err => {
        if (err) {
          throw err;
        }
      });
    }
    if (items) {
      for(const item of items) {
        fs.unlink(path.join(__dirname, 'files-copy', item), err => {
          if (err) throw err;
        });
      }
    }
  });

  fs.readdir(path.resolve(__dirname, 'files'), (err, items) => {
    if(err) {
      throw err;
    }
    for (const item of items) {
      fs.copyFile(path.resolve(__dirname, 'files', item), path.resolve(__dirname, 'files-copy', item), err=> {
        if(err) {
          fs.mkdir(path.resolve(__dirname, 'files-copy'), { recursive: true }, err => {
            if (err) {
              throw err;
            }
          });
        }
      });
    }
  });
}

copyDir();
