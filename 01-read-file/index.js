const fs = require('fs');
const path = require('path');

const readableStream = fs.createReadStream(path.join(__dirname, 'text.txt'));

const { stdout } = process;
readableStream.on('data', data => stdout.write(data));