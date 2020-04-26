import dotenv from 'dotenv';
import childProcess from 'child_process';

const config = dotenv.config();
const env = config.parsed ? config.parsed : {};
let isShuttingDown = false;

const exec = (
  command: string,
  options: childProcess.ExecOptions = {}
): Promise<object> => {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, options, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
};

const startShutdown = (): void => {
  if (!isShuttingDown) {
    isShuttingDown = true;

    setTimeout(() => {
      process.exit(0);
    }, 5000);
  }
};

export { env, exec, isShuttingDown, startShutdown };
