import { spawn, ChildProcess, SpawnOptions } from 'child_process';
import EventEmitter from "events";

declare class Daemon extends EventEmitter {

    constructor(file: string, args?: string[], options?: SpawnOptions);

    file: string;
    args: string[];
    options: SpawnOptions;
    maxRestartTimes: number;
    restartDelay: number;

    readonly restartCount: number;
    readonly process: ChildProcess;

    setMaxRestartTimes(times: number): this;
    setRestartDelay(delay: number): this;
    start(): this;

    on(event: 'die', listener: (code: number, signal: string) => void): this;
    on(event: 'restart', listener: (process: ChildProcess) => void): this;

}

export = Daemon;