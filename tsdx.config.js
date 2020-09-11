// const path = require('path');

const commonjs = require('@rollup/plugin-commonjs');
// const { eslint } = require('rollup-plugin-eslint');

module.exports = {
  rollup(config) {
    // config.plugins.unshift(eslint('.eslintrc.js'));

    /**
     * Manually use the commonjs plugin.
     * This is opposed to specifying umd as the format as there's more implications that, again, are unclear.
     */
    config.plugins.push(commonjs());

    return config;
  },
};
