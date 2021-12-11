const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const db = require('quick.db');
const {
    MessageButton,
    MessageActionRow
} = require('discord.js');

function gen_teams(args) {
    args = args.sort((a, b) => 0.5 - Math.random())

    var team1 = ""
    for (var i = 0; i < Math.floor(args.length / 2); i++) {
        team1 += args[i] + " \n"
    }
    var team2 = ""
    for (var i = Math.floor(args.length / 2); i < args.length; i++) {
        team2 += args[i] + " \n"
    }

    let embed = new Discord.MessageEmbed()
        .setTitle("Team Generator")
        .addField("Team 1", team1, true)
        .addField("Team 2", team2, true)
        .setColor("RANDOM")

    pruneTeams()

    return embed
}

function pruneTeams() {
    let queries = db.get(`teams`)
    if (!queries) return

    for (const [key, val] of Object.entries(queries)) {
        if (Date.now() - val[1] >= 120000) {
            delete queries[key]
            console.log("PRUNED A QUERY")
        }

    }
    db.set(`teams`, queries)
}

// Regular prefix command handling
module.exports = {
    name: "teams",
    description: "Tries to make random teams from given list of names",
    usage: "?teams [name] [name] ... [name]",
    execute(client, message, args) {

        if (args.length <= 1) return message.reply("I need at least 2 names to matchmake")

        const author = message.author

        const rerollBtn = new MessageButton()
            .setLabel('Reroll')
            .setCustomId('teams_reroll')
            .setStyle('PRIMARY')

        const row = new MessageActionRow().addComponents(rerollBtn)
        const embed = gen_teams(args)

        message.channel.send({
            components: [row],
            embeds: [embed]
        }).then(async (message) => {

            if (!db.get('teams')) {
                let allTeams = {}
                allTeams[message.id] = [args, Date.now()]
                db.set('teams', allTeams)
            } else {
                let temp = db.get('teams')
                temp[message.id] = [args, Date.now()]
                db.set('teams', temp)
            }

            const filter = (btn) => {
                return author.id === btn.user.id && btn.message.id == message.id
            }

            const collector = message.channel.createMessageComponentCollector({
                filter,
                time: 120000
            })

            collector.on('collect', async (ButtonInteraction) => {
                //console.log(ButtonInteraction.customId)
                const id = ButtonInteraction.customId
                // console.log(ButtonInteraction.message.id)
                if (id == 'teams_reroll') {
                    const allTeams = db.get('teams')
                    // console.log(allTeams)
                    const row = new MessageActionRow().addComponents(rerollBtn)
                    const embed = gen_teams(allTeams[ButtonInteraction.message.id][0])

                    await ButtonInteraction.message.edit({
                        components: [row],
                        embeds: [embed]
                    })

                }

                ButtonInteraction.deferUpdate()

            })

        })

    }
}