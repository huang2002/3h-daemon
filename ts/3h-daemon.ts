import { spawn, ChildProcess, SpawnOptions } from 'child_process';
import EventEmitter from "events";

export = class Daemon extends EventEmitter {

    public maxRestartTimes: number = Infinity;
    setMaxRestartTimes(times: number): this {
        this.maxRestartTimes = times;
        return this;
    }

    private _restartCount: number = 0;
    get restartCount() {
        return this._restartCount;
    }

    private _process: ChildProcess | undefined;
    get process() {
        return this._process;
    }

    private create = () => {
        let end = false;
        const dieHandler = (code: number, signal: string) => {
            if (end) {
                return;
            }
            this.emit('die', code, signal);
            (this._process as ChildProcess).kill(signal || undefined);
            end = true;
            if (this._restartCount < this.maxRestartTimes) {
                this._restartCount++;
                this.emit('restart', this._process = this.create());
            }
        };
        const p = spawn(process.argv0, [this.file].concat(this.args), this.options);
        p.on('error', dieHandler);
        p.on('close', dieHandler);
        p.on('exit', dieHandler);
        return p;
    };

    constructor(public file: string, public args: string[] = [], public options: SpawnOptions = {}) {
        super();
    }

    start(): this {
        this._process = this.create();
        return this;
    }

};