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

const tmp = tmpdir()
const cmd = require.resolve('./cmd.js')

t.beforeEach((done, t) => {
  mkdtemp(join(tmp, 'create-package-test-'), (err, dir) => {
    t.context.dir = dir
    done(err)
  })
})

t.afterEach((done, t) => {
  rmdir(t.context.dir, { recursive: true }, done)
})

t.test('generate', t => {
  exec(`node ${cmd} -y`, {
    cwd: t.context.dir
  }, (err, stdout) => {
    t.error(err)
    console.log(stdout)
    t.end()
  })
})
