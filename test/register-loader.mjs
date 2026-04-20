import { register } from 'node:module';

register('./esm-loader.mjs', new URL('./', import.meta.url));
