# 3h-log

> A lib that helps you log things with various prefix easily.

## Install

```
$ npm install 3h-log
```

## Example

```javascript
const Logger = require('3h-log');

const logger = new Logger();

logger.warn('A warning with default prefix.');

logger.prefix.warn = 'MyWarn';
logger.warn('A warning with my prefix.');

logger.showTime = false;
logger.error('An error without time.');

logger.preLen += 2;
logger.info('A piece of information with 2 more spaces.');
```

## API

- Logger(out?: stream.Writable) - *The constructor of loggers.*
- logger - ( Any instance of `Logger`. )
    - preLen: number - *Target length of prefixes.*
    - showTime: boolean - *Whether to show the current time.*
    - prefix - *The prefixes.*
        - info: string - *The prefix for `logger.info`.*
        - error: string - *The prefix for `logger.error`.*
        - warn: string - *The prefix for `logger.warn`.*
        - trace: string - *The prefix for `logger.trace`.*
    - write(prefix: string, msg: string) - *To write something.*
    - info(msg: string) - *To log some information.*
    - error(msg: string) - *To log some errors.*
    - warn(msg: string) - *To log some warnings.*
    - trace(msg: string) - *To log some traces.*
