// import exec from './exec';

import Docker from 'dockerode';
import { waterfall } from 'async';
import parse from './parse';
import lodash from 'lodash';

const docker = new Docker({socketPath: '/tmp/run/docker.sock'});

const dockerize = (context, callback) => {


  waterfall([
    (done) => {
      parse(`${process.env.workdir}/${context.repository}/${context.branch}/.trevor.json`, done)
    },
    (trevor, done) => {

      docker.listContainers(function (err, containers) {
        for (let container in containers) {
          var containerInfo = containers[container]
          if (containerInfo.Names[0] === `/${context.repository}.${context.branch}`) {
            var oldContainer = docker.getContainer(`${context.repository}.${context.branch}`);
            return oldContainer.remove({ force: true }, (err) => {
              return done(err, trevor);
            })
          }
        }
        return done(err, trevor)
      })

    },
    (trevor, done) => {
      docker.pull(trevor.image, (err, stream) => {

        console.log('DOCKERIZE ERROR : ',err);
        docker.modem.followProgress(stream, onFinished, onProgress);

        function onFinished(err, output) {
          done(err, trevor);
        }
        function onProgress(event) {
        }
      });
    },
    (trevor, done) => {
      const env = lodash.map(context, (value, key) => {
        return `${key}=${value}`
      })

      console.log(`VOLUME : ${process.env.workdir}/${context.repository}/${context.branch}`);
      console.log(`BIND VOLUME : ${process.env.workdir}:${trevor.workdir}/${context.repository}/${context.branch}`);
      docker.createContainer({
        name: `${context.repository}.${context.branch}`,
        Image: trevor.image,
        AttachStdin: false,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
        Cmd: ['/bin/bash'],
        OpenStdin: false,
        StdinOnce: false,
        WorkingDir: `${process.env.workdir}/${context.repository}/${context.branch}`,
        Env: env,

        Volumes: {
          [`${process.env.workdir}/${context.repository}/${context.branch}`]: {},
          [`/tmp/yarn`]: {},
          [`/root/.ssh`]: {},
        },
        Hostconfig: {

          Binds: [
            `yarn:/tmp/yarn`,
            `/root/.ssh:/root/.ssh`,
            `/var/www/${context.repository}/${context.branch}:${trevor.workdir}/${context.repository}/${context.branch}`,
          ],
        },
        ExposedPorts: {
          [`${trevor.hooks[context.command].expose}/tcp`]: { }
        },
      },done)
    },
    (container, done) => {
      container.start(done)
    },
    (container, done) => {
      done()
    },
  ], (err) => callback(err))
}

export default dockerize;
