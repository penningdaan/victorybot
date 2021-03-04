const Discord = require('discord.js')

// The Victory Bot style message embeds.
module.exports = class VEmbed {

    embed

    /**
     * 
     * @param {Discord.Client} client 
     * @param {*} parms 
     */
    constructor(client, parms = []) {
        this.embed = new Discord.MessageEmbed()
        let th = this
        parms.forEach(p => {
            switch(p) {

                case 'vbot-sender':
                    th.embed.setAuthor('Victory Bot', client.user.avatarURL(), 'https://github.com/penningdaan/victorybot.git')
                break;

            }
        })

        return this
    }

    get() {
        return this.embed
    }
}