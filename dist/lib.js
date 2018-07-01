"use strict";
const EventEmitter = require("events");
const child_process_1 = require("child_process");
class Daemon extends EventEmitter {
    constructor(options = {}) {
        super();
        this.command = '';
        this.args = [];
        this.options = {};
        this.maxRestartTimes = Infinity;
        this.restartDelay = 0;
        this._restartTimes = 0;
        this._active = false;
        Object.assign(this, options);
    }
    get restartTimes() {
        return this._restartTimes;
    }
    get childProcess() {
        return this._childProcess;
    }
    get active() {
        return this._active;
    }
    _start() {
        const childProcess = this._childProcess = child_process_1.spawn(this.command, this.args, this.options);
        childProcess.on('exit', (code, signal) => {
            if (childProcess === this._childProcess) {
                this.emit('exit', code, signal);
                this._stop();
                this.emit('stop', childProcess);
            }
        }).on('error', err => {
            if (childProcess === this._childProcess) {
                this.emit('error', err);
                this._stop();
                this.emit('stop', childProcess);
            }
        });
    }
    _restart() {
        this._start();
        this.emit('restart', this._childProcess);
    }
    _stop() {
        if (++this._restartTimes < this.maxRestartTimes) {
            const { restartDelay } = this;
            if (restartDelay > 0) {
                this._restartTimer = setTimeout(() => {
                    this._restartTimer = undefined;
                    this._restart();
                }, restartDelay);
            }
            else {
                this._restart();
            }
        }
        else {
            this._childProcess = undefined;
            this._active = false;
        }
    }
    start() {
        if (!this._active) {
            this._active = true;
            this._start();
            this.emit('start', this._childProcess);
        }
        return this;
    }
    reset() {
        this._restartTimes = 0;
        return this;
    }
    stop(signal) {
        if (this._active) {
            const { _childProcess, _restartTimer } = this;
            if (_childProcess) {
                _childProcess.kill(signal);
            }
            if (_restartTimer) {
                clearTimeout(_restartTimer);
            }
        }
        return this;
    }
}
module.exports = Daemon;
