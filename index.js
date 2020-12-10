'use strict'

const { spawn } = require('child_process')
const { join } = require('path')
const authors = require('parse-authors')
const defaultGenerator = require('./generator')
// Specifying the extension to avoid clashes with the LICENSE file
// on case insensitive file systems.
const license = require('./license.js')
const log = require('./log')

function getAuthor (packageJson) {
  if (typeof packageJson.author === 'string') {
    return authors(packageJson.author)[0]
  }
  // assuming the author is already in object format
  return packageJson.author
}

function getContext () {
  const dest = process.cwd()
  const pkgInfo = require(join(dest, 'package.json'))
  return {
    year: (new Date(Date.now())).getFullYear(),
    author: getAuthor(pkgInfo),
    package: pkgInfo,
    dest
  }
}

// TODO: use https://github.com/npm/init-package-json
function init () {
  return new Promise((resolve, reject) => {
    log.info(`
Calling 'npm init'
`)
    const args = process.argv.slice(2)
    const cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'
    const npm = spawn(cmd, ['init', ...args], { stdio: 'inherit' })
    npm.on('close', code => {
      return code !== 0 ? reject(new Error(`npm exited with code ${code}`)) : resolve()
    })
    npm.on('error', reject)
  })
}

async function run ({ preGenerate = init, context = getContext, generator = defaultGenerator } = {}) {
  await preGenerate()
  return generator(context())
}

module.exports = {
  run,
  init,
  context: getContext,
  generator: defaultGenerator,
  license,
  log
}
