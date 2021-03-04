const Discord = require('discord.js')

module.exports = class VMultipage {

    currentPage = 0
    maxPage
    updateFunction

    filter = (reaction, user) => {
        return ['⏪', '⏩'].includes(reaction.emoji.name);
    };

    constructor(updateFunction, maxPage) {
        this.updateFunction = updateFunction
        this.maxPage = maxPage
    }

    post(channel) {
        this.send(channel, this.updateFunction(this.currentPage))
    }

    /**
     * @param {Discord.TextChannel} channel 
     * @param {*} content 
     */
    async send(channel, content) {
        let msg = await channel.send(content)
        await msg.react('⏪')
        await msg.react('⏩')

        msg.awaitReactions(this.filter, { max: 1, time: 60000, errors: ['time'] }).then(c => this.__dirListener(c, msg, this)).catch(c=>this.__rejectionSolver(msg))
    }

    /**
     * 
     * @param {*} collected 
     * @param {Discord.Message} msg 
     * @param {this} __multipage 
     */
    async __dirListener(collected, msg, __multipage) {
        const reaction = collected.first();

        if (reaction.emoji.name === '⏩') {
            reaction.users.fetch().then(u => {
                u.each(user => {
                    if(user.id != msg.author.id) {
                        reaction.users.remove(user)
                    }
                })
            })
            
            if(__multipage.currentPage<__multipage.maxPage) {
                __multipage.currentPage++
                let d = __multipage.updateFunction(__multipage.currentPage)
                msg.edit(d)
            }
		} else if(reaction.emoji.name === '⏪') {
            reaction.users.fetch().then(u => {
                u.each(user => {
                    if(user.id != msg.author.id) {
                        reaction.users.remove(user)
                    }
                })
            })
            if(__multipage.currentPage>0) {
                __multipage.currentPage--
                let d = __multipage.updateFunction(__multipage.currentPage)
                msg.edit(d)
            }
            
		}
        msg.awaitReactions(__multipage.filter, { max: 1, time: 60000, errors: ['time'] }).then(c => __multipage.__dirListener(c, msg, __multipage)).catch(c=>__multipage.__rejectionSolver(msg))
    }

    __rejectionSolver(msg) {
        msg.reactions.removeAll()
    }

}