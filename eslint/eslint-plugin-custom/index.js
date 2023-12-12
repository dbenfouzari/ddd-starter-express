/* eslint-disable @typescript-eslint/no-var-requires */

const preferUseLoggers = require("./rules/preferUseLogger");

module.exports = {
  rules: {
    "prefer-use-logger": preferUseLoggers,
  },
  configs: {
    recommended: {
      plugins: ["eslint-plugin-custom"],
      rules: {
        "custom/prefer-use-logger": "error",
      },
    },
  },
};
