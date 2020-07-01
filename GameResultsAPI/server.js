var express = require('express');
var app = express();
var fs = require('fs');

app.use(express.json());

app.get('/', (req, res) => {
    fs.readFile( __dirname + "/" + "games.json", 'utf8', (err, data) => {
      console.log(data);
      res.end(data);
    })
})

// app.post('/', (req, res) => {
//   fs.readFile( __dirname + "/" + "games.json", 'utf8', (err, data) => {
//     data = JSON.parse(data);
//     data[req.body.id]['result'] = req.body.result;
//     console.log(data);
//     res.end(JSON.stringify(data));
//   })
// })

var server = app.listen(8080, () => {
  console.log("Server running on port 8080");
})
