var express = require("express")
var bodyParser = require("body-parser")
var xhub = require("express-x-hub")
var util = require('util')
var app = express()
var git = require('gift')
//Const
var xhubSecret = "azerty"
var port = "8080"
var host = "localhost"

import flow from './lib/flow'
//Secret key
// app.use(xhub({ algorithm: "sha1", secret: xhubSecret }))

// Configure express json
app.use(bodyParser.json())

// Main : Start the express http server
var server = app.listen(port, host, function () {
  console.log(
    "App listening at http://%s:%s",
    server.address().address,
    server.address().port
  )
})

app.get("/health", function (req, res) {
  res
  .status(200)
  .send({ status: 200})
  return
});


// // Add default route
app.post("/webhook", function (req, res) {
  // if(!req.isXHub){
  //   res.status(400).send('Invalid X-Hub Request')
  //   console.log("Secret key is invalid")
  //   return
  // }

  var command = req.headers["x-github-event"]

  // console.log('------------');
  // console.log('GITHUB EVENT');
  // console.log('------------');
  // console.log(command);
  // console.log(req.body);

  const payload  = req.body
  switch (command) {

    case 'push':
      const context = {
        workdir: '/Users/guillaume/Documents/docker',
        owner: payload.repository.owner.login,
        repository: payload.repository.name,
        branch: payload.ref.split('/').slice(-1)[0],
      }
      flow(context);
      break;

  }
  res
  .status(200)
  .send({ status: 200})
  return
})
