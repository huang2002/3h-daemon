#! node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const Daemon = require("./3h-daemon");
const _3h_log_1 = __importDefault(require("3h-log"));
const logger = new _3h_log_1.default();
logger.preLen = 7;
const argv = process.argv.slice(2);
const cmdArgMap = new Map(), fileArgMap = new Map();
let curArgs = cmdArgMap, lastKey = 'f';
argv.forEach(arg => {
    if (arg[0] === '-') {
        if (arg[1] === '-' && curArgs !== fileArgMap) {
            curArgs = fileArgMap;
        }
        else {
            lastKey = arg.slice(1);
            curArgs.set(lastKey, '');
        }
    }
    else {
        curArgs.set(lastKey, arg);
    }
});
let fileArgs = [];
fileArgMap.forEach((v, k) => {
    fileArgs.push('-' + k, v);
});
if (cmdArgMap.has('h')) {
    console.log('Usage:\n' +
        '    3h-daemon [file] [options] [-- arguments]\n' +
        '\n' +
        'Options:\n' +
        '    -h          Show this.\n' +
        '    -t <times>  Set max restart times.\n' +
        '    -d <delay>  Set restart delay.\n' +
        '    -i          No stdin.\n' +
        '    -o          No stdout.\n' +
        '    -e          No stderr.\n');
}
else {
    if (!cmdArgMap.has('f')) {
        console.error('File option missed!');
    }
    else {
        const daemon = new Daemon(cmdArgMap.get('f'), fileArgs, {
            stdio: [
                cmdArgMap.has('i') ? null : 0,
                cmdArgMap.has('o') ? null : 1,
                cmdArgMap.has('e') ? null : 2
            ]
        });
        if (cmdArgMap.has('t')) {
            daemon.setMaxRestartTimes(Number.parseInt(cmdArgMap.get('t')));
        }
        if (cmdArgMap.has('d')) {
            daemon.setRestartDelay(Number.parseInt(cmdArgMap.get('d')));
        }
        daemon.on('die', (code, signal) => {
            logger.write('Die', `code: ${code} signal: ${signal}`);
        }).on('restart', ({ pid }) => {
            logger.write('Restart', `pid: ${pid} count: ${daemon.restartCount}`);
        }).start();
    }
}
