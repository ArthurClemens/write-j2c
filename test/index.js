const styles = require('./styles');

const path = require('path');
const fs = require('fs');
const { writeCSS } = require('../dist/write-j2c');

const assert = require('assert');

/* global describe, it */

describe('writeCSS', () => {
  const getResultPath = fileName =>
    path.resolve(__dirname, `./results/${fileName}`);

  const getExpectedPath = fileName =>
    path.resolve(__dirname, `./expected/${fileName}`);

  it('Defaults: expect file to be minified and have a sourcemap', done => {
    const fileName = 'test-defaults.css';
    const pathResult = getResultPath(fileName);
    const pathExpected = getExpectedPath(fileName);

    writeCSS({
      styles,
      path: pathResult,
    }).then(() => {
      const pathResultMap = getResultPath(`${fileName}.map`);
      const pathExpectedMap = getExpectedPath(`${fileName}.map`);
      const contentResultMapExists = fs.existsSync(pathResultMap);
      if (!contentResultMapExists) {
        return done(new Error('Sourcemap not found'));
      }

      const contentResultMap = fs.readFileSync(pathResultMap, 'utf8');
      const contentExpectedMap = fs.readFileSync(pathExpectedMap, 'utf8');
      assert(contentResultMap === contentExpectedMap);

      const contentResult = fs.readFileSync(pathResult, 'utf8');
      const contentExpected = fs.readFileSync(pathExpected, 'utf8');
      assert(contentResult === contentExpected);

      return done();
    });
  });

  it('No sourcemap: expect file to be minified and not have a sourcemap', done => {
    const fileName = 'test-no-sourcemap.css';
    const pathResult = getResultPath(fileName);
    const pathExpected = getExpectedPath(fileName);
    writeCSS({
      styles,
      path: pathResult,
      sourceMap: false,
    }).then(() => {
      const pathResultMap = getResultPath(`${fileName}.map`);
      const contentResultMapExists = fs.existsSync(pathResultMap);
      assert(!contentResultMapExists);

      const contentResult = fs.readFileSync(pathResult, 'utf8');
      const contentExpected = fs.readFileSync(pathExpected, 'utf8');
      assert(contentResult === contentExpected);

      done();
    });
  });

  it('Beautified: expect file not to be minified, be beautified and have a sourcemap', done => {
    const fileName = 'test-beautify.css';
    const pathResult = getResultPath(fileName);
    const pathExpected = getExpectedPath(fileName);
    writeCSS({
      styles,
      path: pathResult,
      beautify: true,
    }).then(() => {
      const contentResult = fs.readFileSync(pathResult, 'utf8');
      const contentExpected = fs.readFileSync(pathExpected, 'utf8');
      assert(contentResult === contentExpected);

      done();
    });
  });

  it('Gzipped: expect file to be gzipped and have a sourcemap', done => {
    const fileName = 'test-gzip.css';
    const pathResult = getResultPath(fileName);
    const pathExpected = getExpectedPath(fileName);
    writeCSS({
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

      const contentResultGzip = fs.readFileSync(pathResultGzip, 'utf8');
      const contentExpectedGzip = fs.readFileSync(pathExpectedGzip, 'utf8');
      assert(contentResultGzip === contentExpectedGzip);

      const contentResult = fs.readFileSync(pathResult, 'utf8');
      const contentExpected = fs.readFileSync(pathExpected, 'utf8');
      assert(contentResult === contentExpected);

      done();
    });
  });

  it('Wrapped in global: expect file to be wrapped in :global{} and to be beautified', done => {
    const fileName = 'test-global.css';
    const pathResult = getResultPath(fileName);
    const pathExpected = getExpectedPath(fileName);
    writeCSS({
      styles,
      path: pathResult,
      wrapInGlobal: true,
      beautify: true,
      sourceMap: false,
    }).then(() => {
      const contentResult = fs.readFileSync(pathResult, 'utf8');
      const contentExpected = fs.readFileSync(pathExpected, 'utf8');
      assert(contentResult === contentExpected);

      done();
    });
  });
});
