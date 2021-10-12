const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const googleIt = require("google-it");
const {
    MessageButton,
    MessageActionRow
} = require('discord.js');

// Regular prefix command handling
module.exports = {
    name: "google",
    description: "Returns Google's top results",
    usage: "?google",
    async execute(client, message, args) {

        if (!args[0]) {
            if (message.content[0] == '?') return message.reply("You must specify a query to search")
            else return
        }

        let query = args.join(" ");
        googleIt({
            'query': query
        }).then(results => {
            // console.log(results)
            // console.log(results.length)

            if (results.length == 0) {
                if (message.content[0] == '?') return message.reply("I couldn't find anything :(")
                else return
            }
            const author = message.author
            const authorMessageID = message.id

            let currInd = 0
            let desc = results[currInd].snippet
            let search = results[currInd].title
            let chosenOneSRC = results[currInd].link
            let embed = new Discord.MessageEmbed()
                .setTitle(`${search}`)
                .setDescription(`${desc}`)
                .setColor(colours.blue_light)
                .setFooter(`Page ${currInd + 1}`)
                .setTimestamp()

            const nextBtn = new MessageButton()
                .setLabel('Next')
                .setCustomId('google_next')
                .setStyle('PRIMARY')

            const prevBtn = new MessageButton()
                .setLabel('Prev')
                .setCustomId('google_prev')
                .setStyle('PRIMARY')

            const closeBtn = new MessageButton()
                .setLabel('Close')
                .setCustomId('google_close')
                .setStyle('DANGER')

            const sourceBtn = new MessageButton()
                .setLabel('Source')
                .setURL(chosenOneSRC)
                .setStyle('LINK')

            prevBtn.disabled = true

            const row = new MessageActionRow().addComponents(
                nextBtn, prevBtn, sourceBtn, closeBtn
            )

            message.channel.send({
                components: [row],
                embeds: [embed]
            }).then(async (message) => {
                if (currInd >= results.length) return

                const filter = (btn) => {
                    return author.id === btn.user.id
                }

                const collector = message.channel.createMessageComponentCollector({
                    filter,
                    time: 120000
                })

                collector.on('collect', async (ButtonInteraction) => {
                    //console.log(ButtonInteraction.customId)
                    const id = ButtonInteraction.customId

                    if (id === 'google_next') {
                        prevBtn.disabled = false
                        currInd++
                        let desc = results[currInd].snippet
                        let search = results[currInd].title
                        let chosenOneSRC = results[currInd].link
                        let embed = new Discord.MessageEmbed()
                            .setTitle(`${search}`)
                            .setDescription(`${desc}`)
                            .setColor(colours.blue_light)
                            .setFooter(`Page ${currInd + 1}`)
                            .setTimestamp()

                        if (currInd + 1 == results.length) {
                            nextBtn.disabled = true
                        } else {
                            nextBtn.disabled = false
                        }
                        sourceBtn.setURL(chosenOneSRC)

                        const row = new MessageActionRow().setComponents(
                            nextBtn, prevBtn, sourceBtn, closeBtn
                        )

                        await ButtonInteraction.message.edit({
                            components: [row],
                            embeds: [embed]
                        })

                    } else if (id === 'google_prev') {
                        nextBtn.disabled = false
                        currInd--
                        let desc = results[currInd].snippet
                        let search = results[currInd].title
                        let chosenOneSRC = results[currInd].link
                        let embed = new Discord.MessageEmbed()
                            .setTitle(`${search}`)
                            .setDescription(`${desc}`)
                            .setColor(colours.blue_light)
                            .setFooter(`Page ${currInd + 1}`)
                            .setTimestamp()

                        if (currInd === 0) {
                            prevBtn.disabled = true
                        }
                        sourceBtn.setURL(chosenOneSRC)

                        const row = new MessageActionRow().setComponents(
                            nextBtn, prevBtn, sourceBtn, closeBtn
                        )

                        await ButtonInteraction.message.edit({
                            components: [row],
                            embeds: [embed]
                        })

                    } else if (id === 'google_close') {
                        ButtonInteraction.message.delete() // Delete bot embed
                        await message.channel.messages.fetch(authorMessageID).then(message => message.delete()).catch(console.error) // Delete user command call
                        db.delete(`${author.id}.findstarted`)
                        return
                    }

                    ButtonInteraction.deferUpdate()

                })

            })

        }).catch(e => {
            console.log(e)
        })

    }
}