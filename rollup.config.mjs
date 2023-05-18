import json from "@rollup/plugin-json";
import image from "@rollup/plugin-image";
import terser from "@rollup/plugin-terser";
import { rollupPluginHTML as html } from "@web/rollup-plugin-html";
import zip from "rollup-plugin-zip";
import serve from "rollup-plugin-serve";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

import path from "path";
import fs from "fs";
import chalk from "chalk";

const bundleSize = function ({ file }) {
  return {
    name: "rollup-plugin-bundle-size",
    writeBundle: {
      secuential: true,
      order: "post",
      async handler(options, bundle) {
        let uncompressedSize = 0;
        console.log(chalk.green("Filename".padEnd(15, " ") + " Size (bytes)."));
        for (const file in bundle) {
          const { modules } = bundle[file];
          for (const moduleName in modules) {
            const module = modules[moduleName];
            const name = path.basename(moduleName);
            uncompressedSize += module.renderedLength;
            console.log(
              `${chalk.cyan(name.padEnd(15, " "))} ${chalk.cyan(
                module.renderedLength
              )}`
            );
          }
        }

        console.log(
          chalk.green(
            "Total before compression " +
              chalk.bold(chalk.green(uncompressedSize))
          )
        );

        const asset = path.join(options.dir, file);
        const { size } = fs.statSync(asset);
        const percent = parseInt((size / 13312) * 100, 10);
        const color =
          percent < 50 ? chalk.green : percent < 80 ? chalk.yellow : chalk.red;

        console.log(
          `Created bundle ${chalk.cyan(asset)}: ${chalk.bold(
            chalk.cyan(size)
          )} bytes, ${color(percent + "%")} of total game size used.`
        );
      },
    },
  };
};

const zipPlug = zip({ file: "game.zip" });
zipPlug.writeBundle.sequential = true;

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: "public/index.html",
  output: [
    {
      inlineDynamicImports: true,
      dir: "dist",
      format: "iife",
    },
    {
      inlineDynamicImports: true,
      dir: "dist/min",
      format: "iife",
      name: "version",
      plugins: [terser(), zipPlug, bundleSize({ file: "game.zip" })],
    },
  ],
  plugins: [
    html({ minify: true }),
    json(),
    image(),
    nodeResolve(),
    commonjs(),
    serve({ contentBase: "dist/min", port: 8080 }),
  ],
};
