var myArgs = process.argv.slice(2);
console.log('myArgs: ', myArgs);

var XMLHttpRequest = require('xhr2');
var xhr = new XMLHttpRequest();
xhr.open("POST", `http://localhost:${myArgs[2] || 7070}/api/`, true);
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.send(JSON.stringify({
    "id": myArgs[0],
    "result": parseInt(myArgs[1])
}));
