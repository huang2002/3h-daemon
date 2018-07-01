# 3h-log

A logger lib.

# Features

- Log with formatted time stamps (using `3h-time`)
- Log with various prefixes
- Log level control

# Example

```javascript

const Logger = require('3h-log'),
    logger = new Logger({ timeFormat: '[YYYY-MM-DD HH:MM:SS.sss]' });

logger.print('custom', 'Custom messages.');

logger.setLevel('log');

logger.error('Some errors.');
logger.warn('Some warnings.');
logger.info('Some infomation.');
logger.log('Some logs.');
logger.debug('This should not be seen!');

```

# APIs

Just read the type declaration files in [`typings`](typings) to learn the APIs.
