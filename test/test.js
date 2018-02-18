const id = process.pid;
console.log(`${id}->start with args: ${JSON.stringify(process.argv.slice(2))}`);
if (Math.random() >= .5) {
    console.log(`${id}->err`);
    throw new Error('End...');
}
console.log(`${id}->end`);