import fs from 'fs';
import { waterfall } from 'async';
import exec from './execToContainer';
import Docker from 'dockerode';
import parse from './parse';

const docker = new Docker({socketPath: '/tmp/run/docker.sock'});

const generateServerName = (context, trevor) => {
  if (trevor.hooks[context.command].subdomain)
    if (trevor.hooks[context.command].subdomain === '$sha')
      return context.sha + '.' + trevor.hooks[context.command].domain
    return trevor.hooks[context.command].subdomain + '.' + trevor.hooks[context.command].domain
  return trevor.hooks[context.command].domain
}

const redirectToDirectory = (context, trevor) => (`
  server {
          listen 80 ${trevor.hooks[context.command].defaultServer ? 'default_server' : ''};
          listen [::]:80;
          root /var/www/${context.repository}/${context.branch}/${trevor.hooks[context.command].root};
          index ${trevor.hooks[context.command].entrypoint};

          server_name ${generateServerName(context, trevor)};

          location / {
                  try_files $uri $uri/ =404;
          }
  }
`)

const redirectToPort = (context, trevor) => (`
  upstream ${context.command}-${context.sha} {
        least_conn;
        server ${context.repository}.${context.branch}:${trevor.hooks[context.command].expose} weight=10 max_fails=3 fail_timeout=30s;
  }
  server {
        listen 80 ${trevor.hooks[context.command].defaultServer ? 'default_server' : ''};
        listen [::]:80;

        server_name ${generateServerName(context, trevor)};

        location / {
          proxy_pass http://${context.command}-${context.sha};
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;
        }
  }
`)
// server_names_hash_bucket_size 64;
const expose = (context, callback) => {

    var container = docker.getContainer(`nginx-proxy`);
    var network = docker.getNetwork(`nginx-proxy`);

    waterfall([
      (done) => {
        parse(`${process.env.workdir}/${context.repository}/${context.branch}/.trevor.json`, done)
      },
      (trevor, done) => {
        network.connect({
          Container: `${context.repository}.${context.branch}`,
        }, (err, data) => {
          done(err, trevor)

        })
      },
      (trevor, done) => {
        fs.writeFile(`/etc/nginx/conf.d/${context.repository}.${context.branch}.conf`
        , trevor.hooks[context.command].expose
          ? redirectToPort(context, trevor)
          : redirectToDirectory(context, trevor)
        , (err) => {
          done(err, trevor)
        })
      },
      (trevor, done) => {
        exec(container, `nginx -s reload`, (err, response) => {
          done(err, trevor);
        })
      }


    ], (err) => {
      callback(err);
    });
};

export default expose;
