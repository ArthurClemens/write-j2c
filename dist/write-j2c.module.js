import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import fs from 'fs'; // @ts-ignore-line

import J2c from 'j2c'; // @ts-ignore-line

import perfectionist from 'perfectionist';
import postcss from 'postcss';
import tar from 'tar';
// @ts-ignore-line
const j2c = new J2c();
const COLOR_RED = '\x1b[31m';
const COLOR_WHITE = '\x1b[37m';

const makeStyleSheet = function (...styles) {
  return styles.reduce(function (acc, styleList) {
    const scoped = {
      '@global': styleList
    };
    const sheet = j2c.sheet(scoped);
    return acc + sheet;
  }, '');
};

const saveToFile = function (path, cssString) {
  return fs.writeFileSync(path, cssString, 'ascii');
};

const templateWithGlobal = function (css) {
  return `:global {
  ${css}
}`;
};

export const writeCSS = function (props) {
  const sourceMap = props.sourceMap === undefined ? true : props.sourceMap;
  const cssString = props.css ? props.css : props.styles ? props.styles.reduce(function (acc, current) {
    return current !== undefined ? acc + makeStyleSheet(current) : acc;
  }, '') : '';
  const processedCss = props.wrapInGlobal ? templateWithGlobal(cssString) : cssString;
  const mapPath = `${props.path}.map`;
  const plugins = [];

  if (props.autoPrefix) {
    plugins.push(autoprefixer());
  }

  plugins.push(cssnano({
    preset: ['default', {
      reduceIdents: false,
      zindex: false
    }]
  }));

  if (props.beautify) {
    plugins.push(perfectionist({
      indentSize: 2
    }));
  }

  const postCSSOptions = sourceMap ? {
    from: undefined,
    to: props.path,
    map: {
      inline: false
    }
  } : {
    from: undefined
  };
  return new Promise(function (resolve, reject) {
    postcss(plugins).process(processedCss, postCSSOptions).then(function (result) {
      result.warnings().forEach(function (warn) {
        console.warn(COLOR_RED, 'Warning', COLOR_WHITE, warn.toString()); // eslint-disable-line no-console
      });
      saveToFile(props.path, result.css);

      if (props.gzip) {
        tar.c({
          gzip: true
        }, [props.path]).pipe(fs.createWriteStream(`${props.path}.gz`));
      }

      if (sourceMap) {
        saveToFile(mapPath, result.map.toString());
      }

      resolve(result.css);
    }).catch(function () {
      return reject();
    });
  });
};
