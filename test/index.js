const styles = require('./styles');
const styleObject = require('./styleObject');

const path = require('path');
const fs = require('fs');
const { writej2c } = require('../dist/write-j2c');

const assert = require('assert');

/* global describe, it */

const readFile = path =>
  fs.readFileSync(path, 'utf8').trim();
  
describe('writej2c', () => {
  const getResultPath = fileName =>
    path.resolve(__dirname, `./results/${fileName}`);

  const getExpectedPath = fileName =>
    path.resolve(__dirname, `./expected/${fileName}`);

  it('Defaults: expect file to be minified and have a sourcemap', done => {
    const fileName = 'test-defaults.css';
    const pathResult = getResultPath(fileName);
    const pathExpected = getExpectedPath(fileName);

    writej2c({
      styles,
      path: pathResult,
    }).then(() => {
      const pathResultMap = getResultPath(`${fileName}.map`);
      const pathExpectedMap = getExpectedPath(`${fileName}.map`);
      const contentResultMapExists = fs.existsSync(pathResultMap);
      if (!contentResultMapExists) {
        return done(new Error('Sourcemap not found'));
      }

      const contentResultMap = readFile(pathResultMap);
      const contentExpectedMap = readFile(pathExpectedMap);
      assert(contentResultMap === contentExpectedMap);

      const contentResult = readFile(pathResult);
      const contentExpected = readFile(pathExpected);
      assert(contentResult === contentExpected);

      return done();
    });
  });

  it('No sourcemap: expect file to be minified and not have a sourcemap', done => {
    const fileName = 'test-no-sourcemap.css';
    const pathResult = getResultPath(fileName);
    const pathExpected = getExpectedPath(fileName);
    writej2c({
      styles,
      path: pathResult,
      sourceMap: false,
    }).then(() => {
      const pathResultMap = getResultPath(`${fileName}.map`);
      const contentResultMapExists = fs.existsSync(pathResultMap);
      assert(!contentResultMapExists);

      const contentResult = readFile(pathResult);
      const contentExpected = readFile(pathExpected);
      assert(contentResult === contentExpected);

      done();
    });
  });

  it('Beautified: expect file not to be minified, be beautified and have a sourcemap', done => {
    const fileName = 'test-beautify.css';
    const pathResult = getResultPath(fileName);
    const pathExpected = getExpectedPath(fileName);
    writej2c({
      styles,
      path: pathResult,
      beautify: true,
    }).then(() => {
      const contentResult = readFile(pathResult);
      const contentExpected = readFile(pathExpected);
      assert(contentResult === contentExpected);

      done();
    });
  });

  it('Gzipped: expect file to be gzipped and have a sourcemap', done => {
    const fileName = 'test-gzip.css';
    const pathResult = getResultPath(fileName);
    const pathExpected = getExpectedPath(fileName);
    writej2c({
      styles,
      path: pathResult,
      gzip: true,
    }).then(() => {
      const pathResultMap = getResultPath(`${fileName}.map`);
      const contentResultMapExists = fs.existsSync(pathResultMap);
      assert(contentResultMapExists);

      const pathResultGzip = getResultPath(`${fileName}.gz`);
      const pathExpectedGzip = getResultPath(`${fileName}.gz`);
      const contentResultGzipExists = fs.existsSync(pathResultGzip);
      assert(contentResultGzipExists);

      const contentResultGzip = readFile(pathResultGzip);
      const contentExpectedGzip = readFile(pathExpectedGzip);
      assert(contentResultGzip === contentExpectedGzip);

      const contentResult = readFile(pathResult);
      const contentExpected = readFile(pathExpected);
      assert(contentResult === contentExpected);

      done();
    });
  });

  it('Wrapped in global: expect file to be wrapped in :global{} and to be beautified', done => {
    const fileName = 'test-global.css';
    const pathResult = getResultPath(fileName);
    const pathExpected = getExpectedPath(fileName);
    writej2c({
      styles,
      path: pathResult,
      wrapInGlobal: true,
      beautify: true,
      sourceMap: false,
    }).then(() => {
      const contentResult = readFile(pathResult);
      const contentExpected = readFile(pathExpected);
      assert(contentResult === contentExpected);

      done();
    });
  });

  it('Handle a style object', done => {
    const fileName = 'test-object.css';
    const pathResult = getResultPath(fileName);
    const pathExpected = getExpectedPath(fileName);
    writej2c({
      styles: styleObject,
      path: pathResult,
      sourceMap: false,
    }).then(() => {
      const contentResult = readFile(pathResult).trim();
      const contentExpected = readFile(pathExpected).trim();
      assert(contentResult === contentExpected);

      done();
    });
  });
});
