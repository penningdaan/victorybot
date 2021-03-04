const VModule = require('../../vmod')
const Discord = require('discord.js')

let mod = new VModule()

mod.onCommand('purge', (args, msg, module, client) => {
    if(args[0]) {
        msg.guild.members.fetch(msg.author.id).then((gm) => {
            if(gm.hasPermission('MANAGE_MESSAGES')) {
                let n = parseInt(args[0])
                msg.channel.bulkDelete(n)
            } else {
                msg.channel.send('❌ Missing required permission: Manage messages.')
            }
        })
    } else {
        msg.channel.send('❌ Please specify the number of messages to delete.')
    }
})

module.exports = mod