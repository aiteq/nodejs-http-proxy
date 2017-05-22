/*
 * aiteq/nodejs-http-proxy
 * Copyright (c) 2017 Aiteq Reloaded, s.r.o. <info@aiteq.com>
 * MIT Licensed
 */

/**
 * Module dependencies
 */

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const request = require('request');

const PORT = process.env.PORT || 8080;

app.use(cors());                  // enable Cross-origin resource sharing
app.use(bodyParser.json());       // enable JSON-encoded bodies
app.use(bodyParser.urlencoded({   // enable URL-encoded bodies
  extended: true
})); 

// install handler for testing GET request
app.get("/test", (req, res) => {
  res.send("Test success");
});

// install handler for proxy requests
app.post("/proxy", (req, res) => {

  if (!req.body.url) {
    res.status(400).send("Missing url parameter");
    return;
  }

  var options = {
    uri: req.body.url,
    method: 'POST',
    json: req.body  // re-post all data
  };

  // request target url
  request(options, (error, remoteResponse, remoteResponseBody) => {

    error && console.error(error);

    // send untouched response to the origin
    res.status(remoteResponse.statusCode).send(remoteResponseBody);
  })
});

// start the server
app.listen(PORT, () => {
  console.log("App listening on port " + PORT);
});
