var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var fs = require('fs');

app.use(express.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.get('/api/', (req, res) => {
    fs.readFile( __dirname + "/" + "games.json", 'utf8', (err, data) => {
      console.log(data);
      res.end(data);
    });
});

app.post('/api/', (req, res) => {
  fs.readFile( __dirname + "/" + "games.json", 'utf8', (err, data) => {
    console.log(req.body)
    jsonData = JSON.parse(data);
    jsonData[req.body.id]['result'] = req.body.result;
    console.log(jsonData);

    fs.writeFile( __dirname + "/" + "games.json", JSON.stringify(jsonData, null, 2), (err) => {
      if (err) throw err;
      console.log('Data written to file');
    });

    res.end(JSON.stringify(jsonData));
  });
});

var server = app.listen(7070, '0.0.0.0', () => {
  console.log("Server running on port 7070");
});
