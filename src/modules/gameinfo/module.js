const VModule = require('../../vmod')
const fetch = require('node-fetch')
const Discord = require('discord.js')

let gameInfoModule = new VModule()

gameInfoModule.onCommand('ow', (args, msg, module, client) => {
    
    if(args.length == 2) {

        let user = args[0]

        if(user == '@me') {
            user = client.getUserData(msg.author.id, 'ow.default')
        }

        let mode = args[1]
        
        console.log(user)

        fetch(`http://owapi.io/profile/pc/eu/${user}`).then(i => {i.json().then((j)=>{
            if(j['message']) {
                msg.channel.send('❌ User was not found.')
                return
            }

            switch(mode) {
                
                case 'general':
                    let e = new Discord.MessageEmbed()
                        .setImage(j['portrait'])
                        .setAuthor(j['username'], j['portrait'])
                        .addFields(
                            { name: 'Level', value: j['level'] },
                            { name: 'Endorsement', value: 'Endorsement level in percentages' },
                            { name: 'Sportmanship', value: j['endorsement']['sportsmanship']['rate'] + '%', inline: true },
                            { name: 'Shotcaller', value: j['endorsement']['shotcaller']['rate'] + '%', inline: true },
                            { name: 'Good Teammate', value: j['endorsement']['teammate']['rate'] + '%', inline: true },
                            { name: 'Games played', value: 'Total: ' + (j['games']['quickplay']['played'] + j['games']['competitive']['played'])},
                            { name: 'Quickplay', value: j['games']['quickplay']['played'], inline: true },
                            { name: 'Competitive (this season)', value: j['games']['competitive']['played'], inline: true }
                        )
                        .setThumbnail(j['star'])
                        .setColor([249,158,26])
                        .setFooter('Victory bot (c) - Game Info Module')
                        .setTimestamp()
                    msg.channel.send(e)
                break;

                case 'comp':

                    let highestLevel = j['competitive']['tank']['rank'];
                    let highestLevelRole = 'tank'
                    if(j['competitive']['damage']['rank'] > highestLevel ) {highestLevel = j['competitive']['damage']['rank']; highestLevelRole = 'damage'}
                    if(j['competitive']['support']['rank'] > highestLevel ) {highestLevel = j['competitive']['support']['rank']; highestLevelRole = 'support'}

                    let c = new Discord.MessageEmbed()
                    .setAuthor(`${j['username']}'s Competitive Profile`, j['portrait'])
                    .addFields(
                        { name: 'Winrate', value: j['games']['competitive']['win_rate'] + '%' },
                        { name: 'Tank', value: j['competitive']['tank']['rank'] + ' SR', inline:true },
                        { name: 'Damage', value: j['competitive']['damage']['rank'] + ' SR', inline:true },
                        { name: 'Support', value: j['competitive']['support']['rank'] + ' SR', inline:true },
                        { name: 'Playtime', value: j['playtime']['competitive'] },
                        { name: 'Games played', value: j['games']['competitive']['played']},
                        { name: 'Games won', value: j['games']['competitive']['won'], inline:true },
                        { name: 'Games lost', value: j['games']['competitive']['lost'], inline:true },
                        { name: 'Games drawn', value: j['games']['competitive']['draw'], inline:true }
                    )
                    .setThumbnail(j['competitive'][highestLevelRole]['rank_img'])
                    .setColor([249,158,26])
                    .setFooter('Victory bot (c) - Game Info Module')
                    .setTimestamp()
                    msg.channel.send(c)

                break;
    
            }
        })}).catch(e => {
            msg.channel.send('❌ User was not found.')
        })
        

    } else {
        msg.channel.send('❌ Invalid arguments')
    }

    
})

gameInfoModule.onCommand('ow-setme', (args, msg, module, client) => {
    if(args.length == 1) {

        let bId = args[0]

        client.writeUserData(msg.author.id, 'ow.default', bId)

        msg.channel.send('✅ Set your default Overwatch account to '+bId)

    } else {
        msg.channel.send('❌ Invalid arguments')
    }
})

module.exports = gameInfoModule