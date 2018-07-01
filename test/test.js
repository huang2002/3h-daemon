switch (Date.now() % 3) {
    case 0:
        console.log('I will throw an error.');
        throw 'An error just for test.';
    case 1:
        console.log('I will exit 1.');
        process.exit(1);
}

console.log('I will exit 0.');
