
import { waterfall, mapSeries } from 'async';
import step from './step';
import env from './env';
import init from './init';
import run from './run';
import dockerize from './dockerize';
import expose from './expose';

const flow = (context) => {
  console.time('flow');

  waterfall([
    (done) => {
      step('Create Context')
      env(context, done)
    },
    (done) => {
      step('Initialization')
      init(context, done)
    },
    (done) => {
      step('Run commands')
      run(context, done)
    },
    (done) => {
      step('Dockerize')
      dockerize(context, done)
    },
    (done) => {
      step('Expose')
      expose(context, done)
    },
  ], (err, result) => {
    console.log(err, result);
    console.timeEnd('flow');
  })
}

export default flow;
