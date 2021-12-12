const path = require('path');
module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  "framework": "@storybook/vue",
  typescript: {
    check: false,
    checkOptions: {},
  },
  webpackFinal: async (config, { configType }) => {
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader',
        {
          loader: 'sass-loader',
          options: {
            prependData: `@import "./src/assets/_variables.scss";`
          }
        }],
      include: path.resolve(__dirname, '../'),
    });

    // Return the altered config
    return config;
  },
}
