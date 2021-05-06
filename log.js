'use strict'

const { gray, green, red, yellow } = require('chalk')

module.exports = {
  info (...args) {
    console.log(gray(...args))
  },
  warn (...args) {
    console.log(yellow(...args))
  },
  error (...args) {
    console.log(red(...args))
  },
  success (...args) {
    console.log(green(...args))
  }
}
