const fs = require('fs');
const path = require('path');

const pkg = path.join(__dirname, 'pkg');
const folders = fs.readdirSync(pkg);

const assert = (assertion, ...messages) => {
    if (!assertion) {
        console.error(messages);
        throw new Error(messages);
    }
};

try {
    assert(fs.existsSync(pkg), 'pkg directory expected to exist');
    console.log('✔', 'pkg directory expected to exist');

    assert(
        Array.prototype.includes.apply(folders, [
            'dist-browser',
            'dist-src',
            'dist-types',
            'package.json',
        ]),
        `Expected to see:\n${JSON.stringify(
            ['dist-browser', 'dist-src', 'dist-types', 'package.json'],
            null,
            4
        )}\n\nbut saw:\n\n${JSON.stringify(folders, null, 4)}`
    );

    console.log('✔', 'all folders exists');

    assert(
        fs.readFileSync(path.join(__dirname, 'pkg/dist-browser/index.js')).toString() ===
            `!function(){"use strict";var o={foo:!0};console.log(o)}();
`,
        'Files do not match'
    );

    console.log('✔', 'transpiled output matches expected result');
} catch (e) {
    console.error(e.messages);
    process.exit(1);
}