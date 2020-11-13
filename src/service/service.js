'use strict';

const {Cli} = require(`./cli/index`);

const {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  ExitCode,
} = require(`../constants`);

const userArgs = process.argv.slice(USER_ARGV_INDEX);
const [command, param] = userArgs;

if (userArgs.length === 0 || !Cli[command]) {
  Cli[DEFAULT_COMMAND].run();
  process.exit(ExitCode.success);
}

Cli[command].run(param);
