const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const fetch = require('axios')
const {
    MessageButton,
    MessageActionRow
} = require('discord.js');
const db = require('quick.db');

function pruneQueries(author) {
    let queries = db.get(`${author.id}.pfpquery`)
    if (!queries) return

    for (const [key, val] of Object.entries(queries)) {
        if (Date.now() - val[2] > 65000) {
            delete queries[key]
            console.log("PRUNED A QUERY")
        }

    }
    db.set(`${author.id}.pfpquery`, queries)
}

module.exports = {
    name: "avatar",
    description: "Sends profile picture of @'d user",
    usage: "?avatar [@user]",
    async execute(client, message, args) {

        const author = message.author

        if (db.get(`${author.id}.pfpstarted`) && Date.now() - db.get(`${author.id}.pfpstarted`) <= 10000) {
            return message.reply(`Please wait ${ms(10000 - (Date.now()- db.get(`${author.id}.pfpstarted`)))} before starting another query!`)
        } else {
            db.set(`${author.id}.pfpstarted`, Date.now())
            pruneQueries(author)
        }

        const user = message.mentions.users.first() || message.author;

        // This is the global avatar URL
        const displayAvatarURL = user.avatarURL({
            dynamic: true,
            size: 256
        });

        let globalEmbed = new Discord.MessageEmbed()
            .setTitle(`${user.username}'s Profile Picture`)
            .setImage(displayAvatarURL)
            .setColor(colours.green_light)
            .setTimestamp()

        // Fetches Server Profile PFP
        let res = await fetch.get(`https://discord.com/api/guilds/${message.guild.id}/members/${user.id}`, {
            headers: {
                Authorization: `Bot ${botconfig.token}`
            }
        })

        if (res.data.avatar !== undefined && res.data.avatar !== null) {
            let serverAvatarURL = `https://cdn.discordapp.com/guilds/${message.guild.id}/users/${user.id}/avatars/${res.data.avatar}.webp?size=256`
            let animServerAvatarURL = `https://cdn.discordapp.com/guilds/${message.guild.id}/users/${user.id}/avatars/${res.data.avatar}.gif?size=256`
            let serverEmbed = new Discord.MessageEmbed()
                .setTitle(`${user.username}'s Server Profile Picture`)
                .setImage(serverAvatarURL)
                .setColor(colours.green_light)
                .setFooter('Buttons expire after 1 minute')
                .setTimestamp()

            const toggleBtn = new MessageButton()
                .setLabel('Show Global PFP')
                .setCustomId('show_global')
                .setStyle('PRIMARY')
            const toggleGIFBtn = new MessageButton()
                .setLabel('Toggle Animation')
                .setCustomId('show_gif')
                .setStyle('SUCCESS')

            const row = new MessageActionRow().addComponents(
                toggleBtn, toggleGIFBtn
            )

            message.channel.send({
                components: [row],
                embeds: [serverEmbed]
            }).then(async (message) => {
                var currInd = 0
                if (!db.get(`${author.id}.pfpquery`)) {
                    let currQueries = {}
                    currQueries[message.id] = [
                        [serverAvatarURL, displayAvatarURL, animServerAvatarURL], currInd, Date.now()
                    ]
                    db.set(`${author.id}.pfpquery`, currQueries)
                } else {
                    let currQueries = db.get(`${author.id}.pfpquery`)
                    currQueries[message.id] = [
                        [serverAvatarURL, displayAvatarURL, animServerAvatarURL], currInd, Date.now()
                    ]
                    db.set(`${author.id}.pfpquery`, currQueries);
                }
                const filter = (btn) => {
                    return author.id === btn.user.id && btn.message.id == message.id
                }

                const collector = message.channel.createMessageComponentCollector({
                    filter,
                    time: 60000
                })
                collector.on('collect', async (ButtonInteraction) => {
                    const id = ButtonInteraction.customId

                    let queries = db.get(`${author.id}.pfpquery`)

                    if (id === 'show_global') {
                        let avatarURL = queries[ButtonInteraction.message.id][0][1]

                        let globalEmbed = new Discord.MessageEmbed()
                            .setTitle(`${user.username}'s Global Profile Picture`)
                            .setImage(avatarURL)
                            .setColor(colours.green_light)
                            .setFooter('Buttons expire after 1 minute')
                            .setTimestamp()

                        const toggleBtn = new MessageButton()
                            .setLabel('Show Server PFP')
                            .setCustomId('show_server')
                            .setStyle('PRIMARY')

                        const row = new MessageActionRow().addComponents(
                            toggleBtn
                        )
                        await ButtonInteraction.message.edit({
                            components: [row],
                            embeds: [globalEmbed]
                        })

                    } else if (id === 'show_server') {
                        let avatarURL = queries[ButtonInteraction.message.id][0][0]

                        let serverEmbed = new Discord.MessageEmbed()
                            .setTitle(`${user.username}'s Server Profile Picture`)
                            .setImage(avatarURL)
                            .setColor(colours.green_light)
                            .setFooter('Buttons expire after 1 minute')
                            .setTimestamp()

                        const toggleBtn = new MessageButton()
                            .setLabel('Show Global PFP')
                            .setCustomId('show_global')
                            .setStyle('PRIMARY')


                        const toggleGIFBtn = new MessageButton()
                            .setLabel('Toggle Animation')
                            .setCustomId('show_gif')
                            .setStyle('SUCCESS')

                        const row = new MessageActionRow().addComponents(
                            toggleBtn, toggleGIFBtn
                        )
                        await ButtonInteraction.message.edit({
                            components: [row],
                            embeds: [serverEmbed]
                        })
                    } else if (id === 'show_gif') {
                        let avatarURL = queries[ButtonInteraction.message.id][0][2]

                        let globalEmbed = new Discord.MessageEmbed()
                            .setTitle(`${user.username}'s Server Profile Picture`)
                            .setImage(avatarURL)
                            .setColor(colours.green_light)
                            .setFooter('Buttons expire after 1 minute')
                            .setTimestamp()

                        const toggleBtn = new MessageButton()
                            .setLabel('Show Global PFP')
                            .setCustomId('show_global')
                            .setStyle('PRIMARY')

                        const toggleGIFBtn = new MessageButton()
                            .setLabel('Toggle Animation')
                            .setCustomId('show_server')
                            .setStyle('SUCCESS')

                        const row = new MessageActionRow().addComponents(
                            toggleBtn, toggleGIFBtn
                        )
                        await ButtonInteraction.message.edit({
                            components: [row],
                            embeds: [globalEmbed]
                        })
                    }

                    ButtonInteraction.deferUpdate()

                })

            });
        } else {

            message.channel.send({
                embeds: [globalEmbed]
            });
        }



    }
}