'use strict'

const { spawn } = require('child_process')
const { join } = require('path')
const authors = require('parse-authors')
const defaultGenerator = require('./generator')
const license = require('./license')
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

function init () {
  return new Promise((resolve, reject) => {
    log.info(`
Calling 'npm init'
`)
    const args = process.argv.slice(2)
    const npm = spawn('npm', ['init', ...args], { stdio: 'inherit' })
    npm.on('close', code => {
      return code !== 0 ? reject(new Error(`npm exited with code ${code}`)) : resolve()
    })
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
