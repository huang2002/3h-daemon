import EventEmitter = require('events');
import { spawn, SpawnOptions, ChildProcess } from 'child_process';

interface DaemonOptions {
    command?: string;
    args?: string[];
    options?: SpawnOptions;
    maxRestartTimes?: number;
    restartDelay?: number;
}

interface Daemon {
    emit(event: 'start', childProcess: ChildProcess): boolean;
    on(event: 'start', listener: (childProcess: ChildProcess) => void): this;
    emit(event: 'restart', childProcess: ChildProcess): boolean;
    on(event: 'restart', listener: (childProcess: ChildProcess) => void): this;
    emit(event: 'error', err: Error): boolean;
    on(event: 'error', listener: (err: Error) => void): this;
    emit(event: 'stop', childProcess: ChildProcess): boolean;
    on(event: 'stop', listener: (childProcess: ChildProcess) => void): this;
    emit(event: 'exit', code: number, signal: string): boolean;
    on(event: 'exit', listener: (code: number, signal: string) => void): this;
}

class Daemon extends EventEmitter implements DaemonOptions {

    constructor(options: DaemonOptions = {}) {
        super();
        Object.assign(this, options);
    }

    command = '';
    args: string[] = [];
    options: SpawnOptions = {};
    maxRestartTimes = Infinity;
    restartDelay = 0;

    private _restartTimes = 0;
    get restartTimes() {
        return this._restartTimes;
    }

    private _childProcess?: ChildProcess;
    get childProcess() {
        return this._childProcess;
    }

    private _active = false;
    get active() {
        return this._active;
    }

    private _start() {
        const childProcess = this._childProcess = spawn(this.command, this.args, this.options);
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
    private _restartTimer?: NodeJS.Timer;
    private _restart() {
        this._start();
        this.emit('restart', this._childProcess as ChildProcess);
    }
    private _stop() {
        if (++this._restartTimes < this.maxRestartTimes) {
            const { restartDelay } = this;
            if (restartDelay > 0) {
                this._restartTimer = setTimeout(() => {
                    this._restartTimer = undefined;
                    this._restart();
                }, restartDelay);
            } else {
                this._restart();
            }
        } else {
            this._childProcess = undefined;
            this._active = false;
        }
    }

    start() {
        if (!this._active) {
            this._active = true;
            this._start();
            this.emit('start', this._childProcess as ChildProcess);
        }
        return this;
    }

    reset() {
        this._restartTimes = 0;
        return this;
    }

    stop(signal?: string) {
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

export = Daemon;
