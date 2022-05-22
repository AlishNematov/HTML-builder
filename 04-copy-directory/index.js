const fs = require('fs');
const path  = require('path');

function copyDir(sourcePath, destinatonPath) {

  fs.readdir(destinatonPath, async (err, items) => {
    if(err) {
      await fs.mkdir(destinatonPath, { recursive: true }, err => {
        if (err) throw err;
      });
    }
    if (items) {
      for(const item of items) {
        await fs.stat(path.resolve(destinatonPath, item), async (err, stats) => {
          if(err) throw err;
          if(stats.isFile()) {
            await fs.unlink(path.join(destinatonPath, item), err => {
              if (err) throw err;
            });
          }
        })
      }
    }
  });

  fs.readdir(sourcePath, (err, items) => {
    if(err) {
      throw err;
    }
    for (const item of items) {
      fs.stat(path.resolve(sourcePath, item), (err, stats) => { 
        if(err) throw err;
        if(stats.isFile()) {
          fs.copyFile(path.resolve(sourcePath, item), path.resolve(destinatonPath, item), err=> {
            if(err) {
              fs.mkdir(destinatonPath, { recursive: true }, err => {
                if (err) throw err;
              });
            }
          });
        } else {
          copyDir(path.resolve(sourcePath, item), path.resolve(destinatonPath, item));
        }
      })
    }
  });
}

copyDir(path.resolve(__dirname, 'files'), path.resolve(__dirname, 'files-copy'));
