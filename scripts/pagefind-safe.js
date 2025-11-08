/* eslint-disable no-console */
const { existsSync } = require('node:fs')
const { spawn } = require('node:child_process')
const { resolve } = require('node:path')

function outDir() {
  const candidates = ['.next', '.netlify/build', 'out']
  for (const c of candidates) {
    if (existsSync(resolve(process.cwd(), c))) return c
  }
  return null
}

const dir = outDir()
if (!dir) {
  console.log('[pagefind] No build output folder found; skipping index.')
  process.exit(0)
}

try {
  const runner = process.platform === 'win32' ? 'npx.cmd' : 'npx'
  const child = spawn(runner, ['-y', 'pagefind', '--site', dir], {
    stdio: 'inherit',
    env: process.env
  })

  child.on('exit', (code) => {
    if (code === 0) {
      console.log('[pagefind] Index built.')
      process.exit(0)
    } else {
      console.log('[pagefind] Non-zero exit; skipping without failing CI.')
      process.exit(0)
    }
  })
} catch (error) {
  console.log('[pagefind] Not available or failed to run; skipping.', error?.message ?? error)
  process.exit(0)
}
