import { build } from 'esbuild';

build({
  entryPoints: ['./js/script.js'],
  bundle: true,
  outfile: './dist/script.js',
  minify: true,
  sourcemap: true
}).then(() => {
  console.log('EsBuild OK');
}).catch(() => process.exit(1));
