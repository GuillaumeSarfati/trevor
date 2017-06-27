import chalk from 'chalk';
import Docker from 'dockerode';

const docker = new Docker({socketPath: '/tmp/run/docker.sock'});

const execToContainer = (container, cmd, done) => {
  console.time('execution')
  console.log('\n\n\n');
  console.log(chalk.grey('----------------------------'));
  console.log(chalk.grey('Container receive exec event : ', chalk.yellow(cmd)));
  console.log(chalk.grey('----------------------------'));
  container.exec({Cmd: ["bash", "-c", cmd], AttachStdin: true, AttachStdout: true}, (err, exec) => {
    if(err) return done(err);
    exec.start({hijack: true, stdin: true}, (err, stream) => {
      if(err) return done(err);
      stream.on('data', (data) => { console.log(chalk.green(data.toString())); });
      stream.on('error', (err) => { console.log(chalk.red(err.toString())); });
      stream.on('end', (data) => { done(err); });
    })
  });
}
// const execToContainer = (container, cmd, callback) => {
//   console.log('--*--*--*--*--*--*--*--*--*--*--');
//   console.log(chalk.yellow(cmd));
//   console.log('--*--*--*--*--*--*--*--*--*--*--');
//
//   container.exec({
//     Cmd: ['bash', '-c', `'${cmd}'`],
//     AttachStdin: true,
//     AttachStdout: true
//   }, (err, exec) => {
//     exec.start((err, stream) => {
//       console.log(err);
//       // stream.on('data', (data) => {
//       //   console.log('STREAM ON DATA : ', data.toString());
//       // })
//       // stream.on('error', (err) => {
//       //   console.log('STREAM ON DATA : ', err);
//       // })
//       // stream.on('end', (err, data) => {
//       //   console.log('STREAM ON END : ', err, data);
//       //   callback()
//       // })
//
//       docker.modem.demuxStream(stream, process.stdout, process.stderr);
//       exec.inspect((err, data) => {
//         console.log('INSPECT : ', err, data);
//         callback(err)
//       });
//     });
//   });
// };

export default execToContainer;
