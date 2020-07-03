var express = require('express');
var cors = require('cors')
var app = express();
var bodyParser = require('body-parser')

var games = {
  "1": {
    "team1": "Foo",
    "team2": "Bar",
    "result": 0
  },
  "2": {
    "team1": "Bar",
    "team2": "Foobar",
    "result": 0
  },
  "3": {
    "team1": "Foo",
    "team2": "Foobar",
    "result": 0
  }
}

app.use(express.json());
app.use(cors()) // Enable CORS...
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.get('/api/', (req, res) => {
    console.log(games);
    res.json(games);
});

app.post('/api/', (req, res) => {
    console.log(req.body)
    games[req.body.id]['result'] = req.body.result;
    console.log(games);
    res.json(games);
});

var server = app.listen(7070, '0.0.0.0', () => {
  console.log("Server running on port 7070");
});
