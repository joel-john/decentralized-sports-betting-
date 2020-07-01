var myArgs = process.argv.slice(2);
console.log('myArgs: ', myArgs);

var XMLHttpRequest = require('xhr2');
var xhr = new XMLHttpRequest();
xhr.open("POST", "http://localhost:8080/", true);
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.send(JSON.stringify({
    "id": myArgs[0],
    "result": parseInt(myArgs[1])
}));
