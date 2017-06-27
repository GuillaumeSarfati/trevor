import { waterfall, mapSeries } from 'async'
import fs from 'fs'
import Docker from 'dockerode';
// import exec from './exec'
import exec from './execToContainer'
import parse from './parse'

const docker = new Docker({socketPath: '/tmp/run/docker.sock'});

const run = (context, callback) => {

    var container = docker.getContainer(`${context.repository}.${context.branch}`);

    waterfall([
      (done) => {
        parse(`${process.env.workdir}/${context.repository}/${context.branch}/.trevor.json`, done)
      },
      (trevor, done) => {

        mapSeries(trevor.hooks[context.command].flow, (flow, done) => {
          exec(container, flow.cmd, (err, response) => {
            done(err);
          })
        }, (err, response) => {
          done(err);
        })
      }
    ], (err, response) => {
      callback(err);
    })
};

export default run;
