import { waterfall, mapSeries } from 'async'
import exec from './exec'
import parse from './parse'
import fs from 'fs'

const run = (context, callback) => {
    waterfall([
      (done) => {
        parse(`${context.workdir}/${context.repository}/.trevor.json`, done)
      },
      (trevor, done) => {
        mapSeries(trevor.flow, (flow, done) => {
          if (!flow.options) flow.options = {};
          if (!flow.options.cwd) flow.options.cwd = `${context.workdir}/${context.repository}`;

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
