import { defineConfig } from 'astro/config';

const site = process.env.SITE_URL || 'http://localhost:4321';
const configuredBase = process.env.SITE_BASE || '/';
const base = configuredBase === '/' ? '/' : `/${configuredBase.replace(/^\/+|\/+$/g, '')}`;

export default defineConfig({
  output: 'static',
  site,
  base,
});
