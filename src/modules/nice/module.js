const VModule = require('../../vmod')
const Discord = require('discord.js')

let mod = new VModule()

mod.onCommand('summon', (args, msg, module, client) => {
    let user = msg.mentions.users.first();
    user.send('Hey, you have been summoned by ' + msg.author.id + '! Please join the server.')
    msg.channel.send('Message sent')
})

module.exports = mod