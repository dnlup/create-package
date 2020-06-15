'use strict'

const { writeFile } = require('fs')
const generify = require('generify')
const { join } = require('path')
const license = require('./license')
const { info } = require('./log')

const template = join(__dirname, 'template')
const { scripts, engines, devDependencies } = require('./package.json')

const mainTemplate = `
'use strict'

module.exports = {}
`

function onFile (file, action = 'Generated') {
  info(`${action} ${file}`)
}

function generatePackage (context) {
  return new Promise((resolve, reject) => {
    context.package.engines = engines
    context.package.devDependencies = devDependencies
    context.package.scripts = scripts
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
