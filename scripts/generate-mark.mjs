import { readFile, writeFile } from 'node:fs/promises'

// A transparent SVG viewport clips the original logo's outer white margin.
// The logo pixels, including the white letter inside the blue circle, stay intact.
const png = await readFile(new URL('../public/img/logo-64.png', import.meta.url))
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><title>CikTab</title><defs><clipPath id="mark"><circle cx="32" cy="32" r="32"/></clipPath></defs><image x="-4.8" y="-4.8" width="73.6" height="73.6" clip-path="url(#mark)" href="data:image/png;base64,${png.toString('base64')}"/></svg>\n`
await writeFile(new URL('../public/img/logo-mark.svg', import.meta.url), svg)
