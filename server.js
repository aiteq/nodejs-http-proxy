const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const request = require('request');


app.use(cors());                  // enable Cross-origin resource sharing
app.use(bodyParser.json());       // enable JSON-encoded bodies
app.use(bodyParser.urlencoded({   // enable URL-encoded bodies
  extended: true
})); 

// handle testing GET request
app.get("/test", (req, res) => {
  res.send("Test success");
});

// handle proxy POST request
app.post("/proxy", (req, res) => {

  if (!req.body.url) {
    res.status(400).send("Missing url parameter");
    return;
  }

  var options = {
    uri: req.body.url,
    method: 'POST',
    json: req.body
  };

  request(options, (error, response, body) => {

    error && console.error(error);

    res.status(response.statusCode).send(body);

    /*
    if (!error && response.statusCode == 200) {
      res.send(body); // Send the response of the requested url to the frontend.
    }
    */
  })
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("App listening on port " + PORT);
});
