#! /usr/bin/env node

'use strict'
const { run, log } = require('./')

function onDone () {
  log.success(`
Run 'npm i' to install dependencies.
Run 'npm test to run tests.
Run 'npm run lint' to lint the code.
`)
}

function onError (error) {
  log.error(error.stack)
  process.exit(1)
}

run().then(onDone, onError)
