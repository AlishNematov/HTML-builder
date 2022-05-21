const fs = require('fs');
const path  = require('path');

fs.mkdir(path.resolve(__dirname, 'project-dist'), { recursive: true }, err => {
    if (err) {
      throw err;
    }
});

fs.readFile(path.resolve(__dirname, 'template.html'), (err, data) => {
    if(err) {
      throw err;
    }
    
    let text = data.toString()
    fs.readdir(path.resolve(__dirname, 'components'), async (err, items) => {
        if(err) {
          throw err;
        }

        items.forEach(async item => {
          fs.readFile(path.resolve(__dirname, 'components', item), async (err, currentText) => {
            if(text.includes(item.slice(0, item.indexOf('.')))) {
              text = text.replace(`{{${item.slice(0, item.indexOf('.'))}}}`, currentText.toString())
            }
            await fs.promises.writeFile(path.resolve(__dirname, 'project-dist', 'index.html'), text, 'utf8', (err) => {
              if(err){
                throw err;
              }
            });
          })
        })
    })
})

fs.writeFile(path.resolve(__dirname, 'project-dist', 'style.css'), '', 'utf8', (err) => {
  if(err){
    throw err;
  }
});

fs.readdir(path.resolve(__dirname, 'styles'), (err, items) => {
  if(err) {
    throw err;
  }
  items.forEach(item => {
    if (path.parse(path.resolve(__dirname, 'styles', item)).ext === '.css') {
      fs.readFile(path.resolve(__dirname, 'styles', item), (err, data) => {
        if(err) {
          throw err;
        }
        fs.appendFile(path.resolve(__dirname, 'project-dist', 'style.css'), `${data.toString()}\n`, 'utf8', (err) => {
          if(err){
            throw err;
          }
        });
      });
    }
  })
});


function recursiveCopyFiles(sourcePath, destinatonPath){
  fs.mkdir(path.resolve(__dirname, 'project-dist', 'assets'), { recursive: true }, err => {
    if (err) {
      throw err;
    }
});
  fs.readdir(path.resolve(__dirname, sourcePath), (err, items) => {
    items.forEach(item => {
      fs.stat(path.resolve(sourcePath, item), (err, stats) => {
        if(err) throw err;
        if(stats.isFile()) {
          fs.copyFile(path.resolve(sourcePath, item), path.resolve(destinatonPath, item), async err => {
             if(err) {
              await fs.mkdir(path.resolve(__dirname, 'project-dist', 'assets'), { recursive: true }, err => {
                if (err) {
                  throw err;
                }
            });
            }
            });
        } else {
          fs.mkdir(path.resolve(destinatonPath, item), { recursive: true }, err => { if (err) { throw err; }});
          recursiveCopyFiles(path.resolve(sourcePath, item), path.resolve(destinatonPath, item));
        }
      })
    })
  })
}

recursiveCopyFiles(path.resolve(__dirname, 'assets'), path.resolve(__dirname, 'project-dist', 'assets'));