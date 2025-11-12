const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

if (config.transformer?.minifierConfig?.compress) {
  config.transformer.minifierConfig.compress.drop_console = true;
}

module.exports = config;
