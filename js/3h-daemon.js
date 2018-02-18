"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
const child_process_1 = require("child_process");
const events_1 = __importDefault(require("events"));
module.exports = class Daemon extends events_1.default {
    constructor(file, args = [], options = {}) {
        super();
        this.file = file;
        this.args = args;
        this.options = options;
        this.maxRestartTimes = Infinity;
        this.restartDelay = 0;
        this._restartCount = 0;
        this.create = () => {
            let end = false;
            const dieHandler = (code, signal) => {
                if (end) {
                    return;
                }
                this.emit('die', code, signal);
                this._process.kill(signal || undefined);
                end = true;
                if (this._restartCount < this.maxRestartTimes) {
                    this._restartCount++;
                    if (this.restartDelay > 0) {
                        setTimeout(() => {
                            this.emit('restart', this._process = this.create());
                        }, this.restartDelay);
                    }
                    else {
                        this.emit('restart', this._process = this.create());
                    }
                }
            };
            const p = child_process_1.spawn(process.argv0, [this.file].concat(this.args), this.options);
            p.on('error', dieHandler);
            p.on('close', dieHandler);
            p.on('exit', dieHandler);
            return p;
        };
    }
    setMaxRestartTimes(times) {
        this.maxRestartTimes = times;
        return this;
    }
    setRestartDelay(delay) {
        this.restartDelay = delay;
        return this;
    }
    get restartCount() {
        return this._restartCount;
    }
    get process() {
        return this._process;
    }
    start() {
        this._process = this.create();
        return this;
    }
};
