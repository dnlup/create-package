'use strict'
// TODO
// 1. create a package
// 2. check folder contents
// 3. run tests
// 4. done!

const t = require('tap')
const { join } = require('path')
const { rmdir, mkdtemp } = require('fs')
const { tmpdir } = require('os')
const { exec } = require('child_process')
const { gte } = require('semver')

const isGte12 = gte(process.versions.node, '12.0.0')
const tmp = tmpdir()
const cmd = require.resolve('./cmd.js')

t.beforeEach((done, t) => {
  mkdtemp(join(tmp, 'create-package-test-'), (err, dir) => {
    t.context.dir = dir
    done(err)
  })
})

t.afterEach((done, t) => {
  if (isGte12) {
    rmdir(t.context.dir, { recursive: true }, done)
  } else {
    const rimraf = require('rimraf')
    rimraf(t.context.dir, done)
  }
})

t.test('generate', t => {
  exec(`node ${cmd} -y`, {
    cwd: t.context.dir
  }, (err, stdout) => {
    t.error(err)
    t.end()
  })
})
