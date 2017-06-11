git = require('gift')

git.clone "https://github.com/GuillaumeSarfati/test-travis.git"
, "/Users/guillaume/Documents/docker/ex10"
, null
, "master"
, (err, repo) ->
  console.log('git clone');
  console.log(err, repo);
