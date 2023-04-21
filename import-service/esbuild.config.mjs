import esbuildServe from 'esbuild-serve';

esbuildServe(
  {
    logLevel: 'info',
    entryPoints: ['src/handler.ts'],
    bundle: true,
    minify: true,
    outdir: 'dist/',
    platform: 'node',
    sourcemap: true,
  },
);