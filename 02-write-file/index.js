const fs = require('fs');
const path = require('path');
const { stdout, stdin, exit } = process;

stdout.write('Введите сообщение для записи:\n')

fs.writeFile(path.resolve(__dirname, 'text.txt'), '', (err) => {
    if(err){
        throw err;
    }
});

stdin.on('data', data => {
    if(data.toString().slice(0, 4) === 'exit') {
        exit();
    }
    fs.appendFile(path.resolve(__dirname, 'text.txt'), data, (err) => {
        if(err){
            throw err;
        }
    });
});

process.on('SIGINT', () => {
    exit();
});

process.on('exit', () => {
    console.log("Удачи!");
    exit();
});


