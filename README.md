# pika-plugin-legacy-browser

Build a complete package for legacy browsers using @pika/pack.

## Installation

```bash
npm i @pika/pack pika-plugin-legacy-browser
```

## Usage

Like other pika plugins, just add to your pipeline after `@pika/plugin-standard-pkg` or `@pika/plugin-ts-standard-pkg`.

```json
{
    "@pika/pack": {
        "pipeline": [
            ["@pika/plugin-ts-standard-pkg"],
            ["@pika/plugin-build-web"],
            [
                "pika-plugin-legacy-browser",
                {
                    "name": "MyProject"
                }
            ]
        ]
    }
}
```

## Options

| Option       | Values          | Required | Description                                                                                  |
| ------------ | --------------- | -------- | -------------------------------------------------------------------------------------------- |
| name         |                 | yes      | Give your UMD or IIFE a name                                                                 |
| format       | "iife" \| "umd" | no       | **Default:** "iife". Set the desired format.                                                 |
| sourcemap    | boolean         | no       | Set true to enable sourcemaps                                                                |
| globals      | string[]        | no       | [Specify globals](https://rollupjs.org/guide/en/#core-functionality) used by your project.   |
| external     | string[]        | no       | [Specify externals](https://rollupjs.org/guide/en/#core-functionality) used by your project. |
| minify       | boolean         | no       | Minify your browser build                                                                    |
| namedExports | object          | no       | Explicitly resolve not found exports from external modules                                   |
| babel        | babelConfig     | no       | Provide custom Babel plugins or presets                                                      |
