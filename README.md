# 3h-daemon

A daemon lib.

# Usage

## In your command line

```
3h-daemon <command> [options]

    <command>              The command to execute.
                           Default: node

    -h, --help             Show help info.

    -e, --exec             Use `child_process.exec` instead
                           of `child_process.spawn`.

    -a, --args   <args...> The arguments passed to the command.

    -m, --max    <number>  Max restart times.
                           Default: Infinity

    -d, --delay  <number>  Restart delay.

    -t, --time   <format>  Time format.

    -s, --silent           Disable logs.

    --no-stderr            No stderr for the child process.

    --no-stdin             No stdin for the child process.

    --no-stdout            No stdout for the child process.

```

## In your app

See declaration files in [`typings`](typings) to learn the APIs.
