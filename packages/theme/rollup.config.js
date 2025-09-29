import postcss from 'rollup-plugin-postcss';
import path from 'node:path';

export default [
  // Build CSS-only: pkvsinha.css + pkvsinha.min.css
  {
    input: path.resolve('src/styles/index.css'), // imports 01→07 in order
    plugins: [
      postcss({
        extract: 'pkvsinha.css',
        sourceMap: true,
        minimize: false,
        plugins: [
          require('postcss-import')(),
          require('postcss-nesting')(),
          require('autoprefixer')(),
        ],
      }),
    ],
    output: { dir: 'dist', assetFileNames: '[name][extname]' },
  },
  {
    input: path.resolve('src/styles/index.css'),
    plugins: [
      postcss({
        extract: 'pkvsinha.min.css',
        sourceMap: false,
        minimize: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
        plugins: [
          require('postcss-import')(),
          require('postcss-nesting')(),
          require('autoprefixer')(),
          require('cssnano')(),
        ],
      }),
    ],
    output: { dir: 'dist', assetFileNames: '[name][extname]' },
  },
];
