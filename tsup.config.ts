import { defineConfig, Options } from 'tsup';

export default defineConfig((options: Options) => {
  return {
    entry: ['src/index.ts'],
    outDir: 'lib',
    format: ['esm'],
    dts: true,
    minify: false,
    watch: options.watch,
    clean: true,
    platform: 'node',
  };
});
