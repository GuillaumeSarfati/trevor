const express = require('express');
const bodyParser = require('body-parser');
const xhub = require('express-x-hub');
const app = express();

const xhubSecret = 'azerty';
const port = '8888';
const host = '0.0.0.0';

import flow from './lib/flow';

// app.use(xhub({ algorithm: "sha1", secret: xhubSecret }))
app.use(bodyParser.json());

var server = app.listen(port, host, () => {
  console.log(
    'Trevor listening at http://%s:%s',
    server.address().address,
    server.address().port,
  );
});
app.get('/', (req, res) => {
  res
  .status(200)
  .send({
    status: 200,
    message: 'Welcome on Trevor CI'
  });
});
app.get('/health', (req, res) => {
  res
  .status(200)
  .send({ status: 200 });
});


app.post('/webhook', (req, res) => {
  // if(!req.isXHub){
  //   res.status(400).send('Invalid X-Hub Request')
  //   console.log("Secret key is invalid")
  //   return
  // }

  const command = req.headers['x-github-event'];

  const payload = req.body;
  switch (command) {

    case 'push':
      const context = {
        owner: payload.repository.owner.login,
        repository: payload.repository.name,
        branch: payload.ref.split('/').slice(-1)[0],
      };
      flow(context);
      break;

  }
  res
  .status(200)
  .send({ status: 200 });
});
