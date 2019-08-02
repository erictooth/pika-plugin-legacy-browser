import rollupCommonJs from "rollup-plugin-commonjs";
import rollupJson from "rollup-plugin-json";
import rollupNodeResolve from "rollup-plugin-node-resolve";
import rollupBabel from "rollup-plugin-babel";
import { terser as rollupTerser } from "rollup-plugin-terser";
import rollupSourcemaps from "rollup-plugin-sourcemaps";
import babelPresetEnv from "@babel/preset-env";
import babelPluginDefine from "babel-plugin-transform-define";
import path from "path";
import fs from "fs";
import { BuilderOptions, MessageError } from "@pika/types";
import { rollup } from "rollup";

export async function beforeBuild({ options }: BuilderOptions) {
    if (!options.name) {
        throw new MessageError('A "name" option is required for IIFE and UMD builds.');
    }
}

export async function beforeJob({ out }: BuilderOptions) {
    const srcDirectory = path.join(out, "dist-src/");
    if (!fs.existsSync(srcDirectory)) {
        throw new MessageError(
            '"dist-src/" does not exist, or was not yet created in the pipeline.'
        );
    }
    const srcEntrypoint = path.join(out, "dist-src/index.js");
    if (!fs.existsSync(srcEntrypoint)) {
        throw new MessageError(
            '"dist-src/index.js" is the expected standard entrypoint, but it does not exist.'
        );
    }
}

export async function build({ out, options, reporter }: BuilderOptions): Promise<void> {
    const writePath = path.join(out, "dist-browser", "index.js");

    const result = await rollup({
        input: path.join(out, "dist-src/index.js"),
        plugins: [
            rollupNodeResolve({
                preferBuiltins: true,
                mainFields: ["module", "jsnext", "main", "browser"]
            }),
            rollupCommonJs({
                include: "node_modules/**",
                sourceMap: !!options.sourcemap,
                namedExports: options.namedExports
            }),
            rollupJson({
                include: "node_modules/**",
                compact: true
            }),
            rollupBabel({
                exclude: "",
                babelrc: false,
                compact: false,
                sourceMaps: true,
                inputSourceMap: false,
                presets: [
                    [
                        babelPresetEnv,
                        {
                            spec: true
                        }
                    ]
                ],
                plugins: [
                    [
                        babelPluginDefine,
                        {
                            "process.env.NODE_ENV": process.env.NODE_ENV
                        }
                    ]
                ]
            }),
            options.minify !== false
                ? rollupTerser(typeof options.minify === "object" ? options.minify : undefined)
                : undefined,
            rollupSourcemaps()
        ],
        external: options.external
    });

    await result.write({
        file: writePath,
        format: options.format || "iife",
        name: options.name,
        sourcemap: options.sourcemap || false,
        globals: options.globals || {}
    });

    reporter.created(writePath);
}
