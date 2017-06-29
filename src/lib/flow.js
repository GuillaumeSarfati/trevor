
import { waterfall, mapSeries } from 'async';
import statuses from './statuses';
import step from './step';
import env from './env';
import init from './init';
import run from './run';
import dockerize from './dockerize';
import expose from './expose';

const flow = (command, payload) => {
  console.time('flow');

  switch (command) {

    case 'deployment':
      var context = {
        owner: payload.repository.owner.login,
        repository: payload.repository.name,
        branch: 'current',
        sha: payload.deployment.sha,
        command,
      };
      context.command = command
      break;

    case 'pull_request':

      switch (payload.action) {

        case 'opened':
          var context = {
            owner: payload.repository.owner.login,
            repository: payload.repository.name,
            branch: payload.pull_request.head.ref,
            sha: payload.pull_request.head.sha,
            command,
          };
          break;

        case 'synchronize':
          var context = {
            owner: payload.repository.owner.login,
            repository: payload.repository.name,
            branch: payload.pull_request.head.ref,
            sha: payload.pull_request.head.sha,
            command,
          };
          break;

        default:
          return;
          break;
      }

      break;
  }


  waterfall([
    (done) => {
      statuses([
        {
          state: "pending",
          description: "Trevor creating context...",
          context: "Trevor/context"
        },
        {
          state: "pending",
          description: "Trevor cloning project...",
          context: "Trevor/clone"
        },
        {
          state: "pending",
          description: "Trevor dockerizing project...",
          context: "Trevor/docker"
        },
        {
          state: "pending",
          description: "Trevor running scripts...",
          context: "Trevor/scripts"
        },
        {
          state: "pending",
          target_url: `http://${context.sha}.faste.ai/`,
          description: "Trevor exposing project...",
          context: "Trevor/expose"
        },
      ], context, done)
    },
    (done) => {
      step('Create Context')
      env(context, done)
    },
    (done) => {
      statuses([{
       state: "success",
       description: "Trevor created context successfully.",
       context: "Trevor/context"
     }], context, done)
    },
    (done) => {
      step('Initialization')
      init(context, done)
    },
    (done) => {
      statuses([{
       state: "success",
       description: "Trevor cloned the repository successfully.",
       context: "Trevor/clone"
     }], context, done)
    },
    (done) => {
      step('Dockerize')
      dockerize(context, done)
    },
    (done) => {
      statuses([{
       state: "success",
       description: "Trevor dockerized your project successfully.",
       context: "Trevor/docker"
     }], context, done)
    },
    (done) => {
      step('Run commands')
      run(context, done)
    },
    (done) => {
      statuses([{
       state: "success",
       description: "Trevor buildt your project successfully.",
       context: "Trevor/scripts"
     }], context, done)
    },
    (done) => {
      step('Expose')
      expose(context, done)
    },
    (done) => {
      step('Statuses')
      statuses([{
       state: "success",
       target_url: `http://${context.sha}.faste.ai/`,
       description: "Trevor exposed your project successfully.",
       context: "Trevor/expose"
     }], context, done)
    },
  ], (err, result) => {
    if (err && command === 'pull_request') {
      statuses([{
        state: "error",
        target_url: `http://${context.sha}.faste.ai/`,
        description: "Trevor is not Happy !",
        context: "Trevor/expose"
      }], context, (err, response) => {
        console.log(err, response);
      })

    }
    console.timeEnd('flow');
  })
}

export default flow;
