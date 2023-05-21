import fs from 'node:fs';
import { URL } from 'node:url';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';
import clearDeclaration from './plugin-clear-declaration';
import createPackageJson from './plugin-create-package-json';

const packageinfo = JSON.parse(
  fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
);

export default {
  input: './src/index.ts',
  output: {
    name: 'createTextMatcher',
    file: './dist/index.js',
    format: 'umd',
  },
  external: [...Object.keys(packageinfo['dependencies'])],
  plugins: [
    commonjs(),
    del({
      targets: './dist',
    }),
    resolve(),
    typescript(),
    babel({
      babelHelpers: 'bundled',
    }),
    terser(),
    clearDeclaration({
      folder: './dist/types',
      requirements: ['./src/index.d.ts'],
    }),
    copy({
      targets: [
        {
          src: ['./README.md', './LICENSE'],
          dest: './dist',
        },
      ],
    }),
    createPackageJson({
      dist: './dist',
      basic: {
        data: packageinfo,
        keys: [
          'version',
          'description',
          'homepage',
          'license',
          'keywords',
          'author',
          'bugs',
          'repository',
          'dependencies',
        ],
      },
      extra: {
        name: '@shhhplus/text-matcher',
        main: './index.js',
        types: './types/index.d.ts',
      },
    }),
  ],
};
