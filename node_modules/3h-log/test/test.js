const logger = new (require('../3h-log'));

logger.info('info');

logger.showTime = false;
logger.warn('warn without time');
logger.showTime = true;

logger.prefixes.error = 'MyErr';
logger.error('error with my prefix');

const d = 2;
logger.preLen += d;
logger.trace('trace with ' + d + ' more spaces');
