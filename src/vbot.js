const Discord = require('discord.js')
const misc = require('./misctools')
const path = require('path')
const fs = require('fs')
const VEmbed = require('./style/vembed')
const VMultiPage = require('./style/vmultipage')

// The main class for vbot
// Contains the most important components.
module.exports = class Vbot {

    /**
     * The DiscordJS client.
     * Interfaces with the Discord API.
     * 
     * @type Discord.Client
     */
    Client

    /**
     * The loaded modules.
     */
    modules = {}

    /**
     * The loaded module's commands
     */
    loadedCommands = {}

    /**
     * Stores the guild data in memory.
     * Stores in data/guild.json
     */
    guildData = {}

    // TODO: COMMENT
    userData = {}

    // Color schemes:
    colorSchemes = {
        primary: [146,197,80]
    }

    // Gets a piece of data from a specific guild
    getGuildData(guildID, dataID) {
        if(this.guildData[guildID]) {
            if(this.guildData[guildID][dataID]) {
                return this.guildData[guildID][dataID]
            } else return null
        } else return null
    }

    // Write to the guild data
    writeGuildData(guildID, dataID, data) {
        if(!this.guildData[guildID]) {
            this.guildData[guildID] = {}
        }
        this.guildData[guildID][dataID] = data
    }

    // Gets a piece of data from a specific user
    getUserData(userID, dataID) {
        if(this.userData[userID]) {
            if(this.userData[userID][dataID]) {
                return this.userData[userID][dataID]
            } else return null
        } else return null
    }

    // Write to the user data
    writeUserData(userID, dataID, data) {
        if(!this.userData[userID]) {
            this.userData[userID] = {}
        }
        this.userData[userID][dataID] = data
    }

    /**
     * Handles the message command
     * @param {Discord.Message} message 
     * @param {Vbot} __self
     */
    __eventOnMessage(message, __self) {
        if(message.author.id != __self.Client.user.id && message.channel.type != 'dm') {
            let guild = message.guild["id"]
            let usePrefix = '.'
            let messageContent = message.content

            if(__self.getGuildData(guild, 'commands.prefix')) {
                usePrefix = __self.getGuildData(guild, 'commands.prefix')
            }

            // Splice the message into parts based on spaces
            let messageParts = messageContent.split(' ')

            if(messageParts[0].startsWith(usePrefix)) {

                let command = messageParts[0].substr(1)
                console.log(`[${guild}][${message.author.id}] User issued command (call: '${command}') @ ${Date.now()}`)

                if(__self.loadedCommands[command]) {
                    // Execute the command
                    messageParts.shift()
                    __self.modules[__self.loadedCommands[command]['@module']].__emit(command, messageParts, message)
                } else {

                    // System commands
                    switch(command) {

                        case 'help':

                            let allCommands = Object.keys(__self.loadedCommands)

                            let pageSize = 10

                            let e = new VMultiPage((id) => {
                                let helpEmbed = new VEmbed(__self.Client, ['vbot-sender']).get()
                                helpEmbed.setTitle(`Help Menu - Page ${id+1}/${Math.ceil(allCommands.length/pageSize)}`)
                                helpEmbed.setDescription('Full list of commands that can be used with Victory bot.')
                                helpEmbed.setFooter('(c) Victory Bot')
                                helpEmbed.setColor(__self.colorSchemes.primary)
                            
                                allCommands.slice(pageSize * id, pageSize * id + pageSize).forEach(k => {
                                    let args = __self.loadedCommands[k]['arguments']
                                    if(args) {

                                        let s = ''

                                        args.forEach(a => {
                                            s += ' ['+a+']'
                                        })

                                        helpEmbed.addField(k + s, __self.loadedCommands[k]['desc'])
                                    } else {
                                        helpEmbed.addField(k, __self.loadedCommands[k]['desc'])
                                    }
                                })

                                return helpEmbed
                            }, Math.ceil(allCommands.length/pageSize)-1)
                            e.post(message.channel)
                        break;

                    }

                }
            }
        }
    }

    // Starts the bot
    // Logs in to the client, and starts the listeners.
    start() {
        // Create and assign the client
        this.Client = new Discord.Client()

        // Load the bot
        this.load();

        // Discord event listeners
        this.Client.on('ready', () => {console.log(`Connected to Discord API. Bot is ready for command input @ ${Date.now()}`);})
        this.Client.on('message', (msg) => {this.__eventOnMessage(msg,this)})

        // log in to Discord
        this.Client.login(process.env.botToken)
    }

    load() {
        let dirs = misc.getDirectories(path.resolve(__dirname, 'modules'))
        let t = this

        console.log('\x1b[32mVictory Bot\x1b[0m (v. 1.0.0) - Created by Daan Penning')

        let i = 1
        dirs.forEach(d => {
            if(fs.existsSync(d + '/module.json') && fs.existsSync(d + '/module.js')) {
                let moduleManifest = JSON.parse(fs.readFileSync(d + '/module.json', 'utf-8'))
                let mod = require(d + '/module.js')

                if(moduleManifest['package']) {
                    mod.__setup(t)
                    
                    Object.keys(moduleManifest['commands']).forEach((k) => {
                        t.loadedCommands[k] = moduleManifest['commands'][k]
                        t.loadedCommands[k]['@module'] = moduleManifest['package']
                    })

                    t.modules[moduleManifest['package']] = mod
                    console.log(`✔️ Loaded module ${i}/${dirs.length}`)
                } else console.log(`❌ Module ${i}/${dirs.length} is invalid: module.json is missing the required 'package' attribute`)
                
            } else {
                console.log(`❌ Module ${i}/${dirs.length} is invalid: missing module.json or module.js.`)
            }
            i++
        })

        if(fs.existsSync('data/guild.json')) {
            this.guildData = JSON.parse(fs.readFileSync('data/guild.json'))
            console.log('✔️ Loaded guild data from JSON')
        }

        if(fs.existsSync('data/user.json')) {
            this.userData = JSON.parse(fs.readFileSync('data/user.json'))
            console.log('✔️ Loaded user data from JSON')
        }

        // Start the periodic data save. Do this every 15 seconds.
        setInterval(() => {this.__saveData(this)}, 1000*15)
    }

    __saveData(t) {

        let gd = JSON.stringify(t.guildData)
        let ud = JSON.stringify(t.userData)

        fs.writeFileSync('data/guild.json', gd)
        fs.writeFileSync('data/user.json', ud)

        console.log('Saved data @ ' + Date.now())
    }

}