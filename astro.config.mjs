import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({output:'static',base:process.env.DEPLOY_BASE||'/',trailingSlash:'ignore',vite:{plugins:[tailwindcss()]}});
