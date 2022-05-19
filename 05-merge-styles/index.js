const fs = require('fs');
const path  = require('path');

fs.writeFile(path.resolve(__dirname, 'project-dist', 'bundle.css'), '', 'utf8', (err) => {
  if(err){
    throw err;
  }
});

fs.readdir(path.resolve(__dirname, 'styles'), (err, items) => {
  if(err) {
    throw err;
  }

  for (const item of items) {
    if (path.parse(path.resolve(__dirname, 'styles', item)).ext === '.css') {
      fs.readFile(path.resolve(__dirname, 'styles', item), (err, data) => {
        if(err) {
          throw err;
        }
        fs.appendFile(path.resolve(__dirname, 'project-dist', 'bundle.css'), `${data.toString()}\n`, 'utf8', (err) => {
          if(err){
            throw err;
          }
        });
      });
    }
  }
});
