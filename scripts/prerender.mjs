import { readFile, writeFile, rm } from 'node:fs/promises'
import { render } from '../.ssr/entry-server.js'
import { site } from '../site.config.js'

const template = await readFile('dist/index.html', 'utf8')
const markup = await render()
if (!template.includes('<!--app-html-->')) throw new Error('Prerender slot is missing')
await writeFile('dist/index.html', template.replace('<!--app-html-->', markup))
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`)
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${site.url}/</loc></url></urlset>\n`)
await rm('.ssr', { recursive: true, force: true })
console.log('Prerendered index.html; generated robots.txt and sitemap.xml.')
