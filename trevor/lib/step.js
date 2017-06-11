import { blue } from 'chalk'

const step = (name) => {
  console.log(blue(`\n- ${name} ------>\n`));
}

export default step;
