const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack"); // Add this line to import webpack

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        // Define Vue feature flags globally for better tree-shaking
        __VUE_OPTIONS_API__: JSON.stringify(true), // Enable Vue 2 options API
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false), // Disable Vue devtools in production
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false), // Control hydration mismatch details
      }),
    ],
  },
});
