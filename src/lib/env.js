import { exec } from 'child_process';
import { green } from 'chalk';
import parse from './parse';

const context = (context, done) => {

  process.env.workdir = '/var/www'

  for (let key in context) {
    process.env[key] = context[key]
    console.log(green(`SET $${key}=${context[key]}`));
  }
  done();
}
context({}, console.log)
export default context;
