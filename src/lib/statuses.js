

import async from 'async';
import request from 'request';

const Statuses = (statuses, context, callback) => {
  async.map(statuses
  , (status, done) => {
    request.post({
      url: `https://28515662ef122af69e3422b0b2f89865a714b5ab:x-oauth-basic@api.github.com/repos/GuillaumeSarfati/${context.repository}/statuses/${context.sha}`,
      headers: { 'User-Agent': 'GuillaumeSarfati' },
      json: status
    }, (err, body) => {
      console.log(body);
      done(err)
    })
  }
  , (err) => {
    callback(err)
  });

}

export default Statuses;
