require('browser-env')()

const Crypto = require('crypto')
const Fs = require('fs')
const Path = require('path')
const Identicon = require('identicon.js')
const Cheerio = require('cheerio')

const DEFAULT_COLOR = '#fff'
const PROG = Path.basename(__filename)
const OPTS = {
  size: process.env.svg_size || 3750,
  margin: 0,
  format: 'svg'
}

function main () {
  const file = process.argv[2]
  const color = process.argv[3]
  const options = Object.assign({}, OPTS)

  if (!file) {
    console.error(`Usage: ${PROG} FILE [COLOR]`)
    return process.exit(1)
  }

  const data = Fs.readFileSync(file, 'utf8')
  const hash = Crypto.createHash('sha256').update(data.trim()).digest('hex')
  const icon = new Identicon(hash, options)

  const $ = Cheerio.load(icon.toString(true))
  const root = $.root()
  const svg = root.find('svg')
  const group = $('g')
  const style = group.attr('style')
  const fillStyle = style.split(';').filter((s) => s.startsWith('fill:'))
  const fill = fillStyle.length ? fillStyle[0].split(':')[1] : DEFAULT_COLOR

  console.error('Hash:', hash)

  if (process.env.DEBUG) {
    console.error('Style:', style)
    console.error('Color:', color)
    console.error('Fill:', fill)
  }

  group.removeAttr('style')
  svg.removeAttr('style')
  svg.attr('fill', color || fill)

  process.stdout.write(root.html())
}

if (require.main === module) {
  main()
}
