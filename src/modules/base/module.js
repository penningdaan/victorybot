// The base module contains all the code for the base elements of the bot.
// This includes the moderation tools
const VModule = require('../../vmod')
const VEmbed = require('../../style/vembed')

// Create the module instance.
let baseModule = new VModule()

baseModule.onCommand('test', (args, msg, module, client) => {
    msg.channel.send('test!')
})

baseModule.onCommand('vo', (args, msg, module, client) => {
    msg.channel.send("'Vo")
    msg.delete()
})

module.exports = baseModule