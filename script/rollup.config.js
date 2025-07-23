import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import dts from "rollup-plugin-dts";
import copy from "rollup-plugin-copy";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

const packageJson = require("../package.json");

const external = Object.keys(packageJson.peerDependencies || {});
console.log(external);

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.cjs.js",
      format: "cjs",
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
    },
    {
      file: "dist/index.umd.js",
      format: "umd",
      name: "ahooksDemo",
    },
  ],
  external,
  plugins: [
    resolve({ extensions }),
    commonjs(),
    copy({
      targets: [
        {
          src: "./package.json",
          dest: "dist",
        },
      ],
    }),
    babel({
      extensions,
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      presets: [
        "@babel/preset-env",
        "@babel/preset-react",
        "@babel/preset-typescript",
      ],
    }),
  ],
};
