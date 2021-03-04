const fs = require('fs')
const vbot = require('./src/vbot.js')

// Check whether to use the 'env.json'
if(fs.existsSync('env.json')) {
    let ENV = JSON.parse(fs.readFileSync('env.json','utf-8'))

    if(ENV['use']) {
        process.env = ENV
    }
}

const bot = new vbot()
bot.start()