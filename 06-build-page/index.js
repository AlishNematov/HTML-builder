const fs = require('fs');
const path  = require('path');

async function createHTML (templatePath, componentsPath, destPath) {
  await fs.readFile(templatePath, async (err, data) => {
    if(err) { throw err; }
    
    let text = data.toString();
    await fs.promises.readdir(componentsPath, 'utf8')
    .then( async (items) => {
        for(const item of items) {
          let template = await fs.promises.readFile(path.resolve(componentsPath, item));
          let re = new RegExp(`{{${item.slice(0, item.indexOf('.'))}}}`, 'g')
          text = await text.replace(re, template.toString());
        }
        await fs.promises.writeFile(destPath, text, 'utf8', (err) => {
          if(err){ throw err; }
        });
    })
  })
}

async function createCSS(sourcePath, destinatonPath) {
  await fs.promises.readdir(sourcePath, 'utf8')
    .then(async data => {
      let template = '';
      for(const item of data) {
        if (path.parse(path.resolve(sourcePath, item)).ext === '.css') {
          template += await fs.promises.readFile(path.resolve(sourcePath, item)) + '\n';
        }
      }
      await fs.writeFile(destinatonPath, `${template.toString()}`, 'utf8', (err) => {
        if(err){ throw err; }
      });
    }
  )
}

async function copyDir(sourcePath, destinatonPath) {
  await fs.promises.mkdir(destinatonPath, {recursive: true})
  .then(
    await fs.promises.readdir(sourcePath, {withFileTypes: true})
    .then(
       async data => {
         await data.forEach(
        async item => {
          if(item.isFile()) {
            await fs.copyFile(path.join(sourcePath, item.name), path.join(destinatonPath, item.name), err => {if(err) { }});
          } else if(item.isDirectory()) {
            await fs.promises.mkdir(path.join(destinatonPath, item.name), {recursive: true})
            .then(await copyDir(path.join(sourcePath, item.name), path.join(destinatonPath, item.name)))
            .catch(error => {throw error})
          }
        }
      )}
    ).catch(error => {throw error})
  ).catch(error=> {throw error})
}

async function bundleProject() {
  await createHTML(path.join(__dirname, 'template.html'), path.join(__dirname, 'components'), path.join(__dirname, 'project-dist', 'index.html'));
  await createCSS(path.join(__dirname, 'styles'), path.join(__dirname, 'project-dist', 'style.css'));
  await copyDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
}

fs.promises.readdir(__dirname, 'utf8')
.then(async items => {
  if (items.includes('project-dist')) {
    await fs.promises.readdir(path.join(__dirname, 'project-dist'), 'utf-8')
    .then(async data => {
      if(!data.length) {
        await bundleProject();
      } else {
        await data.forEach(async (item, index) => {
          await fs.promises.rm(path.join(__dirname, 'project-dist', item), {recursive: true, maxRetries: 100});
          if(index === 0) {
            await bundleProject();
          }
        })
      }
    }).catch(error => {throw error})
  } else {
    await fs.promises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true})
    .then(
      await bundleProject()
      ).catch(error => {throw error})
  }
})