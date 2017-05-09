const Crypto = require('crypto')
const Fs = require('fs')
const Path = require('path')
const Jdenticon = require('jdenticon')

const PROG = Path.basename(__filename)
const SIZE = process.env.svg_size || 3750

function main () {
  const file = process.argv[2]

  if (!file) {
    console.error(`Usage: ${PROG} FILE`)
    return process.exit(1)
  }

  const data = Fs.readFileSync(file, 'utf8')
  const hash = Crypto.createHash('sha256').update(data.trim()).digest('hex')
  const icon = Jdenticon.toSvg(hash, SIZE)

  console.error('Hash:', hash)

  process.stdout.write(icon)
}

if (require.main === module) {
  main()
}
