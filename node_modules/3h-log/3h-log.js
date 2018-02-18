/**
 * @file 3h-log.js
 * @author 3h
 */

/**
 * @description The main object.
 */
class Logger {
    /**
     * @description The constructor.
     * @param {stream.Writable} out The output stream.
     */
    constructor(out = process.stdout) {
        /**
         * @description The output stream.
         * @type {stream.Writable}
         */
        this.out = out;
        /**
         * @description The prefixes.
         * @type {{[x: string]: string}}
         */
        this.prefixes = {
            info: 'INFO',
            warn: 'WARN',
            error: 'ERROR',
            trace: 'TRACE'
        };
        /**
         * @description The target length of prefixes.
         * @type {number}
         */
        this.preLen = 6;
        /**
         * @description Whether to show the current time.
         * @type {boolean}
         */
        this.showTime = true;
    }
    /**
     * @description To print something.
     * @param {string} prefix The prefix.
     * @param {string} msg The message.
     * @returns {Logger} Return this.
     */
    write(prefix, msg) {
        prefix = ('(' + prefix + ')').padEnd(this.preLen + 2);
        if (this.showTime) {
            prefix = '[' + (new Date()).toLocaleString() + '] ' + prefix;
        }
        this.out.write(prefix + ' ' + msg + '\n');
        return this;
    }
    /**
     * @description To log some infomation.
     * @param {string} msg The message.
     * @returns {Logger} Return this.
     */
    info(msg) {
        this.write(this.prefixes.info, msg);
        return this;
    }
    /**
     * @description To log some warnings.
     * @param {string} msg The message.
     * @returns {Logger} Return this.
     */
    warn(msg) {
        this.write(this.prefixes.warn, msg);
        return this;
    }
    /**
     * @description To log some errors.
     * @param {string} msg The message.
     * @returns {Logger} Return this.
     */
    error(msg) {
        this.write(this.prefixes.error, msg);
        return this;
    }
    /**
     * @description To log some traces.
     * @param {string} msg The message.
     * @returns {Logger} Return this.
     */
    trace(msg) {
        this.write(this.prefixes.trace, msg);
        return this;
    }
}

module.exports = Logger;