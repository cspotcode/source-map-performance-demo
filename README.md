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

```sh
# install deps
yarn

# build
yarn clean && yarn build

# run tests
yarn test
```


## Example Output

### Results for 10000 stack traces.
| node | compiler | options | stack_traces_correct | elapsed_ms |
| ---- | -------- | ------- | -------------------- | ---------- |
| 14.19.1 | esbuild | --enable-source-maps | ❌ | 243607 |
| 14.19.1 | esbuild | -r @cspotcode/source-map-support/register | ✅ | 652 |
| 14.19.1 | esbuild | -r source-map-support/register | ❌ | 648 |
| 14.19.1 | esbuild |  |  | 170 |
| 14.19.1 | tsc | --enable-source-maps | ❌ | 1696 |
| 14.19.1 | tsc | -r @cspotcode/source-map-support/register | ✅ | 628 |
| 14.19.1 | tsc | -r source-map-support/register | ❌ | 558 |
| 14.19.1 | tsc |  |  | 212 |
| 16.14.2 | esbuild | --enable-source-maps | ❌ | 237183 |
| 16.14.2 | esbuild | -r @cspotcode/source-map-support/register | ✅ | 595 |
| 16.14.2 | esbuild | -r source-map-support/register | ❌ | 603 |
| 16.14.2 | esbuild |  |  | 167 |
| 16.14.2 | tsc | --enable-source-maps | ❌ | 1701 |
| 16.14.2 | tsc | -r @cspotcode/source-map-support/register | ✅ | 557 |
| 16.14.2 | tsc | -r source-map-support/register | ❌ | 455 |
| 16.14.2 | tsc |  |  | 188 |
| 17.8.0 | esbuild | --enable-source-maps | ❌ | 240249 |
| 17.8.0 | esbuild | -r @cspotcode/source-map-support/register | ✅ | 557 |
| 17.8.0 | esbuild | -r source-map-support/register | ❌ | 524 |
| 17.8.0 | esbuild |  |  | 160 |
| 17.8.0 | tsc | --enable-source-maps | ❌ | 1311 |
| 17.8.0 | tsc | -r @cspotcode/source-map-support/register | ✅ | 526 |
| 17.8.0 | tsc | -r source-map-support/register | ❌ | 431 |
| 17.8.0 | tsc |  |  | 187 |
| 18.9.1 | esbuild | --enable-source-maps | ❌ | 224955 |
| 18.9.1 | esbuild | -r @cspotcode/source-map-support/register | ✅ | 556 |
| 18.9.1 | esbuild | -r source-map-support/register | ❌ | 524 |
| 18.9.1 | esbuild |  |  | 154 |
| 18.9.1 | tsc | --enable-source-maps | ❌ | 846 |
| 18.9.1 | tsc | -r @cspotcode/source-map-support/register | ✅ | 515 |
| 18.9.1 | tsc | -r source-map-support/register | ❌ | 422 |
| 18.9.1 | tsc |  |  | 192 |
| 18.17.1 | esbuild | --enable-source-maps | ❌ | 239397 |
| 18.17.1 | esbuild | -r @cspotcode/source-map-support/register | ✅ | 481 |
| 18.17.1 | esbuild | -r source-map-support/register | ❌ | 522 |
| 18.17.1 | esbuild |  |  | 150 |
| 18.17.1 | tsc | --enable-source-maps | ❌ | 789 |
| 18.17.1 | tsc | -r @cspotcode/source-map-support/register | ✅ | 465 |
| 18.17.1 | tsc | -r source-map-support/register | ❌ | 412 |
| 18.17.1 | tsc |  |  | 187 |