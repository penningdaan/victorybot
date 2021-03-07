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

mod.onCommand('purgeuser', (args, msg, module, client) => {
    if(args[0] && args[1]) {
        msg.guild.members.fetch(msg.author.id).then((gm) => {
            if(gm.hasPermission('MANAGE_MESSAGES')) {
                
                let u = msg.mentions.users.first()
                if(u === null) {
                    msg.channel.send('❌ Not a valid user.')
                } else {
                    console.log(args)
                    msg.channel.messages.fetch({limit: 100}).then(msgs => {
                        let m = msgs.filter(m => m.author.id == u.id)

                        let n = parseInt(args[1])
                        let i = 0
                        m.each(mn => {
                            if(i<n) {
                                mn.delete()
                            }
                            i++
                        })
                    })
                }
            } else {
                msg.channel.send('❌ Missing required permission: Manage messages.')
            }
        })
    } else {
        msg.channel.send('❌ Please specify the number of messages to delete.')
    }
})

module.exports = mod