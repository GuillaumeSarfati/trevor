import { exec } from 'child_process';
import chalk from 'chalk';

const execColor = (cmd, options, callback) => {
  console.log(`$ > ${chalk.yellow(cmd)}`)
  exec(cmd, options, (err, stdout, stderr) => {
    const color = err ? chalk.red : chalk.green
    console.log(color(stdout + stderr));
    callback(err, stdout + stderr);
  });
};

export default execColor;
