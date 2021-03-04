const { lstatSync, readdirSync } = require('fs')
const { join } = require('path')

let ex = {
    isDirectory: source => lstatSync(source).isDirectory(),
    getDirectories: source => readdirSync(source).map(name => join(source, name)).filter(ex.isDirectory)
}

module.exports = ex