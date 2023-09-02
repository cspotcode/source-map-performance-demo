// random collection of common libraries
import { object, } from 'yup';
import _ from 'lodash';
import express from 'express';
import chalk from 'chalk';
import { dirname } from 'path';
import { readFileSync } from 'fs';

// random code to prevent unused imports from being optimized away
const fishtank = {
    red: chalk.red('fish')
};

_.assign(fishtank, { 
    blue: chalk.blue('fish')
});

const schema = object({
});
schema.validate(fishtank);

const app = express();

// Class which generates a stack frame inside the constructor
class Foo {
    constructor() {
        this.bar();
    }
    bar() { throw new Error('thrown from method called by constructor'); }
}

// test stack trace performance
const args = process.argv.slice(2);
const max = args[0]
    ? parseInt(args[0])
    : 10_000;
const isUsingSourcemaps = args[1] === 'true';

let stackTracesAreCorrect: boolean | null = null;

async function main() {
    const start = Date.now();

    await loop();

    const end = Date.now();
    console.log(JSON.stringify({duration: end - start, stackTracesAreCorrect}));
}

async function loop() {
    // Take one lap around the event loop
    await void 0;

    testStackTrace({
        gen() { new Foo() },
        expectFrames: [{
            mapped:   /    at Foo\.bar \(.*\/index\.ts:29:19\)/,
            unmapped: /    at Foo\.bar \(.*\/index\.js:.*\)/,
            context: ['throw ', 'new Error('],
        }, {
            mapped:   /    at new Foo \(.*\/index\.ts:27:14\)/,
            unmapped: /    at new Foo \(.*\/index\.js:.*\)/,
            context: ['this.', 'bar()']
        }],
    });

    for (let i = 0; i < max; i++) {
        // console.log(`generating stack trace ${i+1}...`);
        const err = new Error();
        if(i === 0) {
            testStackTrace({
                error: err,
                expectFrames: [{
                    mapped:   /    at loop \(.*\/index\.ts:69:21\)/,
                    unmapped: /    at loop \(.*\/index\.js:.*?\)/,
                    context: ['= ', 'new Error']
                }, {
                    mapped:   /    at async main \(.*\/index\.ts:44:5\)/,
                    unmapped: /    at async main \(.*\/index\.js:.*?\)/,
                    context: ['', 'await loop();']
                }]
            });
        }
        // schema.validate(err);
    }
}

// Stack trace tester
const normalizeFilenames = false;
const realProjectDir = dirname(__dirname);
const replacementProjectDir = '/project';
function testStackTrace(o: {
    error?: Error;
    gen?: () => any;
    expectFrames: Array<{
        mapped: RegExp;
        unmapped: RegExp;
        context: [string, string];
    }>;
}) {
    let error!: Error;
    if(o.gen) {
        try {
            o.gen();
        } catch(e) {
            error = e as Error;
        }
    } else {
        error = o.error!;
    }
    let correct = true;
    let stack = error.stack!;
    if(normalizeFilenames) stack = stack.replaceAll(realProjectDir, replacementProjectDir);
    const frames = stack.split('\n').slice(1);
    const frameResults = [];
    for(let i = 0; i < o.expectFrames.length; i++) {
        const frame = frames[i];
        const expectation = o.expectFrames[i];
        if(!expectation) continue;
        const expectedFrame = (isUsingSourcemaps ? expectation.mapped : expectation.unmapped);

        const frameCorrect = expectedFrame.test(frame);
        correct &&= frameCorrect;
        let [, filename, lineStr, colStr] = / \((.*):(\d+):(\d+)\)/.exec(frame)!;
        const lineNo = parseInt(lineStr);
        const colNo = parseInt(colStr);
        if(normalizeFilenames) filename = filename.replace(replacementProjectDir, realProjectDir);
        const line = readFileSync(filename, 'utf8').split('\n')[lineNo - 1];
        const expectedLine = '*'.repeat(colNo - 1 - expectation.context[0].length) + expectation.context.join('');
        const colMarker = ' '.repeat(colNo - 1) + '^';
        frameResults.push({
            correct: frameCorrect,
            expectedFrame,
            actualFrame__: frame,
            expectedContext: expectedLine,
            actualContext__: line,
            column_________: colMarker
        });
    }
    console.dir({correct, stack, frames: frameResults});
    if(isUsingSourcemaps) {
        stackTracesAreCorrect = (stackTracesAreCorrect ?? true) && correct;
    } else {
        if(!correct) throw new Error('Invariant violated: native, unmapped frames look different than we expect.  Our expectations should be updated to match the appearance of native stacktraces.');
    }
}


main();
