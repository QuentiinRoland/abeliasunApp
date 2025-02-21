module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Autres plugins existants...
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
