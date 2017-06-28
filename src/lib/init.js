
import { waterfall, mapSeries } from 'async'
import exec from './exec'
import parse from './parse'
import fs from 'fs'

const run = (context, callback) => {

    waterfall([
      (done) => {
        parse(`${__dirname}/../.trevor.json`, done)
      },
      (trevor, done) => {
        mapSeries(trevor.hooks[context.command].flow, (flow, done) => {
          if (!flow.options) flow.options = {};
          if (!flow.options.cwd) flow.options.cwd = `${process.env.workdir}`;

          exec(flow.cmd, flow.options, (err, response) => {
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
