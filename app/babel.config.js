module.exports = {
  presets: ["module:@react-native/babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./"],
        alias: {
          "@": "./app",
          "@shared": "./shared",
        },
        extensions: [".ts", ".tsx", ".js", ".json"],
      },
    ],
  ],
};
