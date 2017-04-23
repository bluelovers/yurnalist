/* @flow */

import ConsoleReporter from './reporters/console/console-reporter';

import type {ReporterOptions} from './reporters/base-reporter';

const defaultOptions = {
  emoji: true,
};

function createReporter(options?: ReporterOptions = {}): ConsoleReporter {
  const reporter = new ConsoleReporter({
    emoji: options.emoji && process.stdout.isTTY && process.platform === 'darwin',
    verbose: options.verbose,
    noProgress: options.noProgress,
    isSilent: options.silent,
  });

  reporter.initPeakMemoryCounter();

  return reporter;
}

const reporter = createReporter(defaultOptions);

function bindMethods(methods: string[], instance): Object {
  return methods.reduce((result, name) => {
    try {
      /* $FlowFixMe: Indexible signature not found */
      result[name] = instance[name].bind(instance);
      return result;
    } catch (e) {
      throw new ReferenceError(`Unable to bind method: ${name}`);
    }
  }, {});
}

const boundMethods = bindMethods(
  [
    'table',
    'step',
    'inspect',
    'list',
    'header',
    'footer',
    'log',
    'success',
    'error',
    'info',
    'command',
    'warn',
    'question',
    'tree',
    'activitySet',
    'activity',
    'select',
    'progress',
    'close',
  ],
  reporter,
);

module.exports = Object.assign({}, boundMethods, {createReporter});
