const fs = require('fs');
const path  = require('path');
const { stdout } = process;

fs.readdir(path.resolve(__dirname, 'secret-folder'), {withFileTypes: true}, (err, items) => {
  if (err) {
    throw err;
  }
  for (const item of items) {
    let information = [];
    if(item.isFile()) {
      information.push(item.name.slice(0, item.name.lastIndexOf('.')));
      information.push(path.parse(item.name).ext.slice(1));
      fs.stat(path.resolve(__dirname, 'secret-folder', item.name), (err, stats) => {
        if(err) {throw err;}
        information.push(`${stats.size/1000}kb`);
        stdout.write(`${information.join(' - ')}\n`);
      });
    }
  }
});
