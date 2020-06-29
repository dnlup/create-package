'use strict'

const { writeFile } = require('fs')
const generify = require('generify')
const { join } = require('path')
// Specifying the extension to avois clashes with the LICENSE
// file on case insensitive file systems.
const license = require('./license.js')
const { info } = require('./log')

const template = join(__dirname, 'template')
const { scripts, engines, devDependencies } = require('./package.json')

const mainTemplate = `
'use strict'

module.exports = {}
`

const packageTemplate = {
  scripts,
  engines,
  devDependencies: {
    husky: devDependencies.husky,
    'lint-staged': devDependencies['lint-staged'],
    'markdown-toc': devDependencies['markdown-toc'],
    standard: devDependencies.standard,
    'standard-version': devDependencies['standard-version'],
    tap: devDependencies.tap
  }
}

function onFile (file, action = 'Generated') {
  info(`${action} ${file}`)
}

function generatePackage (context) {
  return new Promise((resolve, reject) => {
    for (const field in packageTemplate) {
      context.package[field] = Object.assign({}, context.package[field], packageTemplate[field])
    }
    if (context.package.name.startsWith('@')) {
      context.package.publishConfig = { access: 'public' }
    }
    const data = JSON.stringify(context.package, null, 2)
    const file = join(context.dest, 'package.json')
    writeFile(file, data, 'utf8', err => {
      if (err) {
        return reject(err)
      }
      onFile(file, 'Updated')
      resolve()
    })
  })
}

function generateTemplate (context) {
  info(`
Running generator
`)
  return new Promise((resolve, reject) => {
    const data = {
      name: context.package.name,
      description: context.package.description || 'Description',
      author: context.author,
      year: context.year,
      license: license(context.package.license, context.author, context.year)
    }
    generify(template, context.dest, data, onFile, function onDone (err) {
      return err ? reject(err) : resolve()
    })
  })
}

function injectMain (context) {
  return new Promise((resolve, reject) => {
    if (!context.package.main) {
      return resolve()
    }
    const file = join(context.dest, context.package.main)
    writeFile(file, mainTemplate, 'utf8', err => {
      if (err) {
        return reject(err)
      }
      onFile(file)
      resolve()
    })
  })
}

module.exports = function generator (context) {
  return Promise.all([
    generatePackage(context),
    generateTemplate(context),
    injectMain(context)
  ])
}
