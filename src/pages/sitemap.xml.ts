import type { APIRoute } from 'astro';
// Staging deliberately lists no public URLs. Set a reviewed domain and production
// indexability policy together before emitting canonical production URLs.
export const GET: APIRoute=()=>new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>',{headers:{'Content-Type':'application/xml'}});
