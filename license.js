'use strict'

const licenses = require('choosealicense-list')

const noop = (template) => template

const transformers = {
  ISC (template, author = '', year = '') {
    return template.replace('[fullname]', author).replace('[year]', year)
  },
  MIT (template, author, year) {
    return transformers.ISC(template, author, year)
  }
}

module.exports = function getLicense (spdxId, author, year) {
  const empty = ''
  if (!spdxId || !licenses[spdxId]) return empty
  const template = licenses[spdxId].body
  const transformer = transformers[spdxId] || noop
  return transformer(template, author.name, year)
}
