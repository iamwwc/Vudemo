import { parseHtml } from './src/html-parser'

const testSrc = `
<div id="app" class="demo">
{{ message }} + {{ title }}
</div>`


let ast = parseHtml(testSrc.trim())
let a

