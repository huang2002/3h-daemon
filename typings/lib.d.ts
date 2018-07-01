/// <reference types="node" />
import EventEmitter = require('events');
import { SpawnOptions, ChildProcess } from 'child_process';
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
declare class Daemon extends EventEmitter implements DaemonOptions {
    constructor(options?: DaemonOptions);
    command: string;
    args: string[];
    options: SpawnOptions;
    maxRestartTimes: number;
    restartDelay: number;
    private _restartTimes;
    readonly restartTimes: number;
    private _childProcess?;
    readonly childProcess: ChildProcess | undefined;
    private _active;
    readonly active: boolean;
    private _start;
    private _restartTimer?;
    private _restart;
    private _stop;
    start(): this;
    reset(): this;
    stop(signal?: string): this;
}
export = Daemon;
