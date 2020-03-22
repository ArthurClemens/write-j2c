
const presets = [
  [
    '@babel/preset-typescript',
    {
      targets: {
        esmodules: true,
      },
    },
  ],
];

const plugins = [
  '@babel/plugin-transform-arrow-functions',
  '@babel/plugin-transform-object-assign',
  '@babel/plugin-proposal-object-rest-spread',
];

module.exports = {
  presets,
  plugins,
};
