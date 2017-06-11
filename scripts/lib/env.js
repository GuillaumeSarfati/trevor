import { exec } from 'child_process';
import { green } from 'chalk';

const context = (context, done) => {
  for (let key in context) {
    process.env[key] = context[key]
    console.log(green(`SET $${key}=${context[key]}`));
  }
  done(null);
}

export default context;
