module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            dotenv: false,
            "dotenv-expand": false,
          },
        },
      ],
    ],
  };
};
