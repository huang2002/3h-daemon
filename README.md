# 3h-daemon

> A daemon lib.

## Using in your command line:
```
$ npm install 3h-daemon -g
$ 3h-daemon -h
Usage:
    3h-daemon [file] [options] [-- arguments]

Options:
    -h          Show this.
    -t <times>  Set max restart times.
    -i          No stdin.
    -o          No stdout.
    -e          No stderr.
```

## Using in your app:

### Install
```
$ npm install 3h-daemon
```

### Use
```javascript
const Daemon = require('3h-Daemon');
const daemon = new Daemon(
    'sever.js', // The name of the file to guard.
    ['--port', '80'], // Some arguments for it.
    { stdio: [0, 1, null] } // Options for `child_process.spawn`.
);
daemon.on('die', (code, signal) => {
    console.log(`Died! ( Code:${code} Signal:${signal} )`);
}).on('restart', process => {
    console.log(`Restart! ( pid:${process.pid} )`);
}).setMaxRestartTimes(10).start();
```

### API
- Daemon(file: string, args?: string[], options?: child_process.SpawnOptions) - *The constructor.*
    - process: child_process.ChildProcess - *The current process of that file.*
    - restartCount: number - *How many times has the file been restarted.*
    - maxRestartTimes: number - *Max restart times.*
    - file: string - *The name of the file to guard.*
    - args: string[] - *The arguments for it.*
    - options: child_process.SpawnOptions - *Options for `child_process.spawn`.*
    - setMaxRestartTimes(times: number): this - *Set `maxRestartTimes` to times.*
    - start(): this - *Start guarding.*
    - on(event: 'die', listener: (code: number, signal: string) => void): this - *Emitted when that process exits.*
    - on(event: 'restart', listener: (process: child_process.ChildProcess) => void): this - *Emitted when that process restarts.*

## ps
This lib is developed in `typescript`, so here's a `3h-daemon.d.ts` file specified in `package.json`. Therefore, you can also use this lib in `typescript`.
