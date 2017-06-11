import { mapSeries } from 'async';
import chalk from 'chalk';
import exec from './exec'

const init = (options, done) => {
  const CLEAN = `rm -rf ${options.workdir}/${options.repository}`
  const CLEAN_OPTIONS = {cwd : `${options.workdir}`};
  const GIT_CLONE = `git clone -q --progress -b ${options.branch} https://github.com/${options.owner}/${options.repository}.git ${options.repository}`
  const GIT_CLONE_OPTIONS = {cwd : `${options.workdir}`};
  const CD = `cd ${options.workdir}/${options.repository}`
  const CD_OPTIONS = {}

  const initFlow = [
    { cmd: CLEAN, options: CLEAN_OPTIONS },
    { cmd: GIT_CLONE, options: GIT_CLONE_OPTIONS },
    { cmd: CD, options: CD_OPTIONS },
  ]

  mapSeries(initFlow, (cmd, done) => {
    exec(cmd.cmd, cmd.options, (err, response) => {
      done(err)
    });
  }, (err, results) => {
    done(err)
  });
}

export default init;
