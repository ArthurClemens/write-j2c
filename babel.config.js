
const presets = [
  [
    '@babel/preset-typescript',
    {
      targets: {
        esmodules: false,
      },
    },
  ],
];

const plugins = [
  '@babel/plugin-transform-arrow-functions',
  '@babel/plugin-transform-object-assign',
  '@babel/plugin-proposal-object-rest-spread',
  "@babel/plugin-transform-modules-commonjs"
];

module.exports = {
  presets,
  plugins,
};
