// import { mapSeries } from 'async';
// import chalk from 'chalk';
// import exec from './exec'
//
// const init = (options, done) => {
//   const CLEAN = `rm -rf ${options.workdir}/${options.repository}`
//   const CLEAN_OPTIONS = {cwd : `${options.workdir}`};
//   const GIT_CLONE = `git clone -q --progress -b ${options.branch} https://github.com/${options.owner}/${options.repository}.git ${options.repository}`
//   const GIT_CLONE_OPTIONS = {cwd : `${options.workdir}`};
//   const CD = `cd ${options.workdir}/${options.repository}`
//   const CD_OPTIONS = {}
//
//   const initFlow = [
//     { cmd: CLEAN, options: CLEAN_OPTIONS },
//     { cmd: GIT_CLONE, options: GIT_CLONE_OPTIONS },
//     { cmd: CD, options: CD_OPTIONS },
//   ]
//
//   mapSeries(initFlow, (cmd, done) => {
//     exec(cmd.cmd, cmd.options, (err, response) => {
//       done(err)
//     });
//   }, (err, results) => {
//     done(err)
//   });
// }
//
// export default init;

import { waterfall, mapSeries } from 'async'
import exec from './exec'
import parse from './parse'
import fs from 'fs'

const run = (context, callback) => {
    waterfall([
      (done) => {
        console.log('TREVOR INIT FILE PATH: ');
        console.log(`${__dirname}/../.trevor.init.json`);
        parse(`${__dirname}/../.trevor.init.json`, done)
      },
      (trevor, done) => {
        console.log('trevor : ', trevor);
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
