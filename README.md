# Source Map Performance Demo

This project is a simple experiment to get a general sense of the correctness
and performance penalty incurred for enabling source map support in a node
runtime using various techniques.

The approach taken is to generate builds of a simple application using 
both `esbuild` and `tsc`. The application imports a few commonly used libraries
to intentionally inflate the resulting source maps. We then generate N number of
stack traces, and record the elapsed time. 

- `index.ts` - simple test app to generate stacks and test their correctness
- `run-tests.ts` - run timing tests for combinations of node version, compiler, and sourcemap support options.

Related Discussions:
- https://github.com/nodejs/node/issues/41541
- https://github.com/nodejs/node/issues/42417
- https://github.com/evanw/node-source-map-support/issues/122

## Usage
Requirements:
* Node v14+
* Docker
* yarn

To run the full suite of tests in docker and capture a table of benchmark results:

```sh
# install deps
yarn

# build
yarn clean && yarn build

# run tests
yarn test
```

To run locally and investigate differences in stack traces:

```sh
yarn clean && yarn build:ts
yarn run-tests-locally
```

Exit code will always be zero, but it will log an object describing each test.

## Example Output

### Results for 10000 stack traces.
| node | compiler | options | stack_traces_correct | elapsed_ms |
| ---- | -------- | ------- | -------------------- | ---------- |
| 16.20.2 | esbuild | --enable-source-maps | ❌ | 235261 |
| 16.20.2 | esbuild | -r @cspotcode/source-map-support/register | ✅ | 579 |
| 16.20.2 | esbuild | -r source-map-support/register | ❌ | 574 |
| 16.20.2 | esbuild |  |  | 160 |
| 16.20.2 | tsc | --enable-source-maps | ❌ | 1352 |
| 16.20.2 | tsc | -r @cspotcode/source-map-support/register | ✅ | 559 |
| 16.20.2 | tsc | -r source-map-support/register | ❌ | 449 |
| 16.20.2 | tsc |  |  | 199 |
| 17.9.1 | esbuild | --enable-source-maps | ❌ | 240502 |
| 17.9.1 | esbuild | -r @cspotcode/source-map-support/register | ✅ | 580 |
| 17.9.1 | esbuild | -r source-map-support/register | ❌ | 539 |
| 17.9.1 | esbuild |  |  | 158 |
| 17.9.1 | tsc | --enable-source-maps | ❌ | 1358 |
| 17.9.1 | tsc | -r @cspotcode/source-map-support/register | ✅ | 564 |
| 17.9.1 | tsc | -r source-map-support/register | ❌ | 453 |
| 17.9.1 | tsc |  |  | 190 |
| 18.17.1 | esbuild | --enable-source-maps | ❌ | 243588 |
| 18.17.1 | esbuild | -r @cspotcode/source-map-support/register | ✅ | 498 |
| 18.17.1 | esbuild | -r source-map-support/register | ❌ | 533 |
| 18.17.1 | esbuild |  |  | 152 |
| 18.17.1 | tsc | --enable-source-maps | ❌ | 832 |
| 18.17.1 | tsc | -r @cspotcode/source-map-support/register | ✅ | 473 |
| 18.17.1 | tsc | -r source-map-support/register | ❌ | 428 |
| 18.17.1 | tsc |  |  | 193 |
| 19.9.0 | esbuild | --enable-source-maps | ❌ | 326 |
| 19.9.0 | esbuild | -r @cspotcode/source-map-support/register | ✅ | 521 |
| 19.9.0 | esbuild | -r source-map-support/register | ❌ | 525 |
| 19.9.0 | esbuild |  |  | 155 |
| 19.9.0 | tsc | --enable-source-maps | ❌ | 296 |
| 19.9.0 | tsc | -r @cspotcode/source-map-support/register | ✅ | 499 |
| 19.9.0 | tsc | -r source-map-support/register | ❌ | 419 |
| 19.9.0 | tsc |  |  | 188 |
| 20.5.1 | esbuild | --enable-source-maps | ❌ | 419 |
| 20.5.1 | esbuild | -r @cspotcode/source-map-support/register | ✅ | 454 |
| 20.5.1 | esbuild | -r source-map-support/register | ❌ | 483 |
| 20.5.1 | esbuild |  |  | 141 |
| 20.5.1 | tsc | --enable-source-maps | ❌ | 336 |
| 20.5.1 | tsc | -r @cspotcode/source-map-support/register | ✅ | 438 |
| 20.5.1 | tsc | -r source-map-support/register | ❌ | 384 |
| 20.5.1 | tsc |  |  | 173 |