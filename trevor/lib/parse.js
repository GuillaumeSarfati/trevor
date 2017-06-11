import fs from 'fs';

const parse =  (path, callback) => {
  fs.readFile(path, (err, data) => {
    if (err) return callback(err)
    callback(null, JSON.parse(data.toString()));
  })
}

export default parse;
