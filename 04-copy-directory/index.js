const fs = require('fs');
const path  = require('path');

async function copyDir(sourcePath, destinatonPath) {
  await fs.promises.readdir(__dirname, 'utf8')
    .then(async data => {
      if(data.includes('files-copy')) {
        await fs.promises.readdir(destinatonPath)
          .then(
            async data => {
              if(!data.length) {
                await letCopyFiles(sourcePath, destinatonPath);
              } else {
                for(let item of data) {
                  await fs.promises.rm(path.join(destinatonPath, item), {recursive: true, maxRetries: 100})
                    .catch(err => {console.log(err);});
                }
                await letCopyFiles(sourcePath, destinatonPath);
              }
            }
          ).catch(err => {console.log(err);});
      } else {
        await fs.promises.mkdir(destinatonPath).then(letCopyFiles(sourcePath, destinatonPath)).catch(err => {console.log(err);});
      }
    }).catch(err => {console.log(err);});
  
}

async function letCopyFiles(sourcePath, destinatonPath) {
  await fs.promises.readdir(sourcePath, {withFileTypes: true})
    .then(async data => {
      for(const item of data){
        if(item.isFile()) {
          await fs.copyFile(path.join(sourcePath, item.name), path.join(destinatonPath, item.name), err => {if(err) { throw err; }});
        } else {
          await fs.promises.mkdir(path.join(destinatonPath, item.name), {recursive: true})
            .then(await letCopyFiles(path.join(sourcePath, item.name), path.join(destinatonPath, item.name)))
            .catch(err => {console.log(err);});
        }
      }
    }).catch(err => {console.log(err);});
}

copyDir(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));

