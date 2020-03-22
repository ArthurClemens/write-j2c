"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writeCSS = void 0;

var _autoprefixer = _interopRequireDefault(require("autoprefixer"));

var _cssnano = _interopRequireDefault(require("cssnano"));

var _fs = _interopRequireDefault(require("fs"));

var _j2c = _interopRequireDefault(require("j2c"));

var _perfectionist = _interopRequireDefault(require("perfectionist"));

var _postcss = _interopRequireDefault(require("postcss"));

var _tar = _interopRequireDefault(require("tar"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-ignore-line
// @ts-ignore-line
// @ts-ignore-line
const j2c = new _j2c.default();
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
  return _fs.default.writeFileSync(path, cssString, 'ascii');
};

const templateWithGlobal = function (css) {
  return `:global {
  ${css}
}`;
};

const writeCSS = function (props) {
  const sourceMap = props.sourceMap === undefined ? true : props.sourceMap;
  const cssString = props.css ? props.css : props.styles ? props.styles.reduce(function (acc, current) {
    return current !== undefined ? acc + makeStyleSheet(current) : acc;
  }, '') : '';
  const processedCss = props.wrapInGlobal ? templateWithGlobal(cssString) : cssString;
  const mapPath = `${props.path}.map`;
  const plugins = [];

  if (props.autoPrefix) {
    plugins.push((0, _autoprefixer.default)());
  }

  plugins.push((0, _cssnano.default)({
    preset: ['default', {
      reduceIdents: false,
      zindex: false
    }]
  }));

  if (props.beautify) {
    plugins.push((0, _perfectionist.default)({
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
    (0, _postcss.default)(plugins).process(processedCss, postCSSOptions).then(function (result) {
      result.warnings().forEach(function (warn) {
        console.warn(COLOR_RED, 'Warning', COLOR_WHITE, warn.toString()); // eslint-disable-line no-console
      });
      saveToFile(props.path, result.css);

      if (props.gzip) {
        _tar.default.c({
          gzip: true
        }, [props.path]).pipe(_fs.default.createWriteStream(`${props.path}.gz`));
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

exports.writeCSS = writeCSS;
