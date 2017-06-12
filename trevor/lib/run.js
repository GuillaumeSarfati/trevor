import { waterfall, mapSeries } from 'async'
import exec from './exec'
import parse from './parse'
import fs from 'fs'

const run = (context, callback) => {
    waterfall([
      (done) => {
        parse(`${process.env.workdir}/${context.repository}/.trevor.json`, done)
      },
      (trevor, done) => {
        exec(`rm -rf ${trevor.workdir}/${context.repository}`, {}, (err, response) => {
          done(err, trevor);
        })
      },
      (trevor, done) => {
        exec(`mkdir -p ${trevor.workdir}/${context.repository}`, {}, (err, response) => {
          done(err, trevor);
        })
      },
      (trevor, done) => {

        exec(`cp -rf ${process.env.workdir}/${context.repository} ${trevor.workdir}/.`, {}, (err, response) => {
          process.env.workdir = trevor.workdir
          done(err, trevor);
        })
      },
      (trevor, done) => {

        mapSeries(trevor.flow, (flow, done) => {
          if (!flow.options) flow.options = {};
          if (!flow.options.cwd) flow.options.cwd = `${process.env.workdir}/${context.repository}`;

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
