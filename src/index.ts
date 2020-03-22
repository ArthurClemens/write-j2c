import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import fs from 'fs';
// @ts-ignore-line
import J2c from 'j2c';
// @ts-ignore-line
import perfectionist from 'perfectionist';
import postcss, { AcceptedPlugin, Result } from 'postcss';
import tar from 'tar';

type StyleObject = object;
type Style = { [selector: string]: StyleObject };
type Styles = Style[];

// @ts-ignore-line
const j2c = new J2c();
const COLOR_RED = '\x1b[31m';
const COLOR_WHITE = '\x1b[37m';

const makeStyleSheet = (...styles: Styles[]) =>
  styles.reduce((acc, styleList) => {
    const scoped = {
      '@global': styleList,
    };
    const sheet = j2c.sheet(scoped);
    return acc + sheet;
  }, '');

const saveToFile = (path: string, cssString: string) =>
  fs.writeFileSync(path, cssString, 'ascii');

const templateWithGlobal = (css: string) => `:global {
  ${css}
}`;

interface writeCSSOptions {
  /**
   * CSS text, for instance from an existing .css file
   */
  css: string;

  /**
   * Style object.
   */
  styles: Styles[];

  /**
   * File path to write to.
   */
  path: string;

  /**
   * Include browser vendor prefixes.
   */
  autoPrefix: boolean;

  /**
   * Beautify the output.
   */
  beautify: boolean;

  /**
   * Include source maps.
   */
  sourceMap: boolean;

  /**
   * Enable gzip compression.
   */
  gzip: boolean;

  /**
   * To use with CSS Modules: set to `true` to wrap the generated css inside a `:global { ... }` tag.
   */
  wrapInGlobal: boolean;
}

export const writeCSS = (props: writeCSSOptions) => {
  const sourceMap = props.sourceMap === undefined ? true : props.sourceMap;
  const styles = Array.isArray(props.styles)
    ? props.styles
    : [props.styles];
  const cssString = props.css
    ? props.css
    : styles
    ? styles.reduce(
        (acc: string, current: Styles) =>
          current !== undefined ? acc + makeStyleSheet(current) : acc,
        '',
      )
    : '';
  const processedCss = props.wrapInGlobal
    ? templateWithGlobal(cssString)
    : cssString;

  const mapPath = `${props.path}.map`;

  const plugins: AcceptedPlugin[] = [];
  if (props.autoPrefix) {
    plugins.push(autoprefixer());
  }
  plugins.push(
    cssnano({
      preset: [
        'default',
        {
          reduceIdents: false,
          zindex: false,
        },
      ],
    }),
  );
  if (props.beautify) {
    plugins.push(
      perfectionist({
        indentSize: 2,
      }),
    );
  }

  const postCSSOptions = sourceMap
    ? {
        from: undefined,
        to: props.path,
        map: { inline: false },
      }
    : { from: undefined };

  return new Promise((resolve, reject) => {
    postcss(plugins)
      .process(processedCss, postCSSOptions)
      .then((result: Result) => {
        result.warnings().forEach(warn => {
          console.warn(COLOR_RED, 'Warning', COLOR_WHITE, warn.toString()); // eslint-disable-line no-console
        });
        saveToFile(props.path, result.css);
        if (props.gzip) {
          tar
            .c({ gzip: true }, [props.path])
            .pipe(fs.createWriteStream(`${props.path}.gz`));
        }
        if (sourceMap) {
          saveToFile(mapPath, result.map.toString());
        }
        resolve(result.css);
      })
      .catch(() => reject());
  });
};
