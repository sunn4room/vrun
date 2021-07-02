module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      mainProcessFile: "./src/main.ts",
      rendererProcessFile: "./src/renderer.ts",
    },
  },
};
