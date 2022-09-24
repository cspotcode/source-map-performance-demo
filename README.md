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
| 14.19.1 | esbuild | --enable-source-maps | ❌ | 228617 |
| 14.19.1 | esbuild | -r @cspotcode/source-map-support/register | ✅ | 633 |
| 14.19.1 | esbuild | -r source-map-support/register | ❌ | 576 |
| 14.19.1 | esbuild |  |  | 165 |
| 14.19.1 | tsc | --enable-source-maps | ❌ | 1392 |
| 14.19.1 | tsc | -r @cspotcode/source-map-support/register | ✅ | 606 |
| 14.19.1 | tsc | -r source-map-support/register | ❌ | 461 |
| 14.19.1 | tsc |  |  | 203 |
| 16.14.2 | esbuild | --enable-source-maps | ❌ | 217194 |
| 16.14.2 | esbuild | -r @cspotcode/source-map-support/register | ✅ | 561 |
| 16.14.2 | esbuild | -r source-map-support/register | ❌ | 523 |
| 16.14.2 | esbuild |  |  | 151 |
| 16.14.2 | tsc | --enable-source-maps | ❌ | 1278 |
| 16.14.2 | tsc | -r @cspotcode/source-map-support/register | ✅ | 533 |
| 16.14.2 | tsc | -r source-map-support/register | ❌ | 423 |
| 16.14.2 | tsc |  |  | 181 |
| 17.8.0 | esbuild | --enable-source-maps | ❌ | 219057 |
| 17.8.0 | esbuild | -r @cspotcode/source-map-support/register | ✅ | 549 |
| 17.8.0 | esbuild | -r source-map-support/register | ❌ | 507 |
| 17.8.0 | esbuild |  |  | 151 |
| 17.8.0 | tsc | --enable-source-maps | ❌ | 1259 |
| 17.8.0 | tsc | -r @cspotcode/source-map-support/register | ✅ | 531 |
| 17.8.0 | tsc | -r source-map-support/register | ❌ | 408 |
| 17.8.0 | tsc |  |  | 181 |
| 18.9.1 | esbuild | --enable-source-maps | ❌ | 209886 |
| 18.9.1 | esbuild | -r @cspotcode/source-map-support/register | ✅ | 529 |
| 18.9.1 | esbuild | -r source-map-support/register | ❌ | 513 |
| 18.9.1 | esbuild |  |  | 155 |
| 18.9.1 | tsc | --enable-source-maps | ❌ | 833 |
| 18.9.1 | tsc | -r @cspotcode/source-map-support/register | ✅ | 513 |
| 18.9.1 | tsc | -r source-map-support/register | ❌ | 421 |
| 18.9.1 | tsc |  |  | 189 |