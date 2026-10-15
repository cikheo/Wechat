import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { site } from './site.config.js'

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char])

export default defineConfig({
  define: { __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()) },
  server: { host: '0.0.0.0', port: 5174, strictPort: true },
  preview: { host: '0.0.0.0', port: 4174, strictPort: true },
  plugins: [
    vue(),
    {
      name: 'ciktab-seo',
      transformIndexHtml(html) {
        const schema = {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: site.title,
          description: site.description,
          url: `${site.url}/`,
          inLanguage: 'zh-CN',
          primaryImageOfPage: { '@type': 'ImageObject', url: `${site.url}${site.qrImage}`, width: 258, height: 258 },
          about: { '@type': 'Organization', name: site.name, description: site.description, identifier: site.accountId, logo: `${site.url}${site.logoImage}`, url: `${site.url}/` },
        }
        return html
          .replaceAll('{{TITLE}}', escapeHtml(site.title))
          .replaceAll('{{DESCRIPTION}}', escapeHtml(site.description))
          .replaceAll('{{URL}}', escapeHtml(site.url))
          .replace('{{SCHEMA}}', JSON.stringify(schema).replaceAll('<', '\\u003c'))
      },
    },
  ],
})
