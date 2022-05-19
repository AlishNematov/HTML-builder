const fs = require('fs');
const path  = require('path');
const { stdout, stdin, exit } = process;

fs.readdir(path.resolve(__dirname, 'secret-folder'), {withFileTypes: true}, (err, items) => {
    for (var i=0; i<items.length; i++) {
        let information = [];
        if(items[i].isFile()) {
            information.push(items[i].name.slice(0, items[i].name.lastIndexOf('.')));
            information.push(path.parse(items[i].name).ext.slice(1));
            fs.stat(path.resolve(__dirname, 'secret-folder', items[i].name), (err, stats) => {
                if(err) {throw err}
                information.push(`${stats.size/1000}kb`);
                stdout.write(`${information.join(' - ')}\n`)
            });
        }
    }
})
