import stream = require('stream');

type WritableStream = stream.Writable;

export default class Logger {
    constructor(out?: WritableStream);
    out: WritableStream;
    prefix: { [prefix: string]: string };
    preLen: number;
    showTime: boolean;
    write(prefix: string, msg: string): this;
    info(msg: string): this;
    error(msg: string): this;
    warn(msg: string): this;
    trace(msg: string): this;
}
