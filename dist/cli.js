#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Daemon = require("./lib");
const CLI = require("3h-cli");
const Logger = require("3h-log");
const noIOFlag = (flag) => flag ? 'ignore' : 'inherit', getNum = (map, key) => Number(map.get(key)[0]);
const cli = CLI.create({
    name: '3h-daemon',
    title: 'A cli daemon tool.',
    lineGapSize: 1,
    nameSize: 13,
    gapSize: 10
}).first({
    name: 'command',
    help: 'The command to execute.\n' +
        'Default: node'
}).arg({
    name: 'h',
    alias: ['-help'],
    help: 'Show help info.'
}).arg({
    name: 'e',
    alias: ['-exec'],
    help: 'Use `child_process.exec` instead\n' +
        'of `child_process.spawn`.'
}).arg({
    name: 'a',
    alias: ['-args'],
    val: 'args...',
    help: 'The arguments passed to the command.'
}).arg({
    name: 'm',
    alias: ['-max'],
    val: 'number',
    help: 'Max restart times.\n' +
        'Default: Infinity'
}).arg({
    name: 'd',
    alias: ['-delay'],
    val: 'number',
    help: 'Restart delay.'
}).arg({
    name: 't',
    alias: ['-time'],
    val: 'format',
    help: 'Time format.'
}).arg({
    name: 's',
    alias: ['-silent'],
    help: 'Disable logs.'
}).arg({
    name: '-no-stderr',
    help: 'No stderr for the child process.'
}).arg({
    name: '-no-stdin',
    help: 'No stdin for the child process.'
}).arg({
    name: '-no-stdout',
    help: 'No stdout for the child process.'
}).on('extra', arg => {
    throw `Unknown arg "${arg}"!`;
}).on('exec', args => {
    if (args.has('h')) {
        return cli.help();
    }
    const daemon = new Daemon({
        command: args.has('commands') ? args.get('command').join(' ') : 'node',
        args: args.get('a'),
        options: {
            stdio: [
                noIOFlag(args.has('-no-stdin')),
                noIOFlag(args.has('-no-stdout')),
                noIOFlag(args.has('-no-stderr'))
            ]
        },
        exec: args.has('e')
    });
    if (args.has('m')) {
        daemon.maxRestartTimes = getNum(args, 'm');
    }
    if (args.has('d')) {
        daemon.restartDelay = getNum(args, 'd');
    }
    if (!args.has('s')) {
        const logger = new Logger();
        if (args.has('t')) {
            logger.timeFormat = args.get('t')[0];
        }
        daemon.on('start', childProcess => {
            logger.info(`Child process start! (pid: ${childProcess.pid})`);
        }).on('stop', childProcess => {
            logger.info(`Child process stop! (pid: ${childProcess.pid})`);
        }).on('restart', childProcess => {
            logger.info(`Child process restart! (pid: ${childProcess.pid})`);
        }).on('exit', (code, signal) => {
            logger.info(`Child process exit! (code: ${code} signal: ${signal})`);
        }).on('error', err => {
            logger.error('An error occurred!');
            console.log(err);
        });
    }
    daemon.start();
}).exec(process.argv);
