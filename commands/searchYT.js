const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const ytsr = require("ytsr");
const db = require('quick.db');
const ms = require("ms");
const {
    MessageButton,
    MessageActionRow
} = require('discord.js');

module.exports = {
    name: "yt",
    description: "Searches YouTube and sends Video details",
    usage: "?yt [query]",
    async execute(bot, message, args) {

        const query = args.join(" ");
        if (!query) {
            return message.reply("Must provide a search query!")
        }
        const author = message.author;

        if (db.get(`${author.id}.ytstarted`) && Date.now() - db.get(`${author.id}.ytstarted`) <= 35000) {
            return message.reply(`Please close your most recent yt command or wait ${ms(35000 - (Date.now()- db.get(`${author.id}.ytstarted`)))} before starting another query!`)
        } else {
            db.set(`${author.id}.ytstarted`, Date.now())
        }


        const intros = ['Searching YouTube for', 'Scouring YouTube for', 'Researching YouTube Recommended for', 'Checking a YouTube comment section for', 'Feeling lucky? Looking for']
        let choice = intros[Math.floor(Math.random() * intros.length)]
        message.channel.send(`${choice} \`${query}\` <a:working:821570743329882172>`).then(async (message) => {
            const res = await ytsr(query).catch(e => {
                console.log(e)
                return message.reply("No results found.")
            });

            const results = res.items.filter(i => i.type == "video");
            var currInd = 0;
            let video = results[currInd];
            if (!video) {
                return message.edit("No results found.")
            }

            const embed = new Discord.MessageEmbed()
                .setTitle(video.title)
                .setImage(video.bestThumbnail.url)
                .setColor("RED")
                .addField("Views", video.views.toLocaleString(), true)
                .addField("Duration", video.duration, true)

            const nextBtn = new MessageButton()
                .setLabel('Next')
                .setCustomId('YT_next')
                .setStyle('PRIMARY')

            const prevBtn = new MessageButton()
                .setLabel('Prev')
                .setCustomId('YT_prev')
                .setStyle('PRIMARY')

            const closeBtn = new MessageButton()
                .setLabel('Close')
                .setCustomId('YT_close')
                .setStyle('DANGER')

            const sourceBtn = new MessageButton()
                .setLabel('Source')
                .setURL(video.url)
                .setStyle('LINK')

            prevBtn.disabled = true
            const row = results.length > 1 ? new MessageActionRow().addComponents(
                prevBtn, nextBtn, sourceBtn, closeBtn
            ) : new MessageActionRow().addComponents(
                sourceBtn, closeBtn
            )

            message.edit(' ­') //invisible char to make embed edit cleaner
            message.edit({
                components: [row],
                embeds: [embed]
            }).then(async (message) => {

                if (results.length == 1) return

                const filter = (btn) => {
                    return author.id === btn.user.id && btn.message.id == message.id
                }

                const collector = message.channel.createMessageComponentCollector({
                    filter,
                    time: 30000
                })

                collector.on('collect', async (ButtonInteraction) => {
                    //console.log(ButtonInteraction.customId)
                    const id = ButtonInteraction.customId

                    if (id === 'YT_next') {
                        prevBtn.disabled = false
                        currInd++
                        let video = results[currInd]
                        const embed = new Discord.MessageEmbed()
                            .setTitle(video.title)
                            .setImage(video.bestThumbnail.url)
                            .setColor("RED")
                            .addField("Views", video.views.toLocaleString(), true)
                            .addField("Duration", video.duration, true)

                        if (currInd == 9 || currInd == results.length) {
                            nextBtn.disabled = true
                        } else {
                            nextBtn.disabled = false
                        }

                        sourceBtn.setURL(video.url)
                        const row = new MessageActionRow().addComponents(
                            prevBtn, nextBtn, sourceBtn, closeBtn
                        )
                        await ButtonInteraction.message.edit({
                            components: [row],
                            embeds: [embed]
                        })

                    } else if (id === 'YT_prev') {
                        nextBtn.disabled = false
                        currInd--
                        let video = results[currInd]
                        const embed = new Discord.MessageEmbed()
                            .setTitle(video.title)
                            .setImage(video.bestThumbnail.url)
                            .setColor("RED")
                            .addField("Views", video.views.toLocaleString(), true)
                            .addField("Duration", video.duration, true)

                        if (currInd === 0) {
                            prevBtn.disabled = true
                        }

                        sourceBtn.setURL(video.url)
                        const row = new MessageActionRow().addComponents(
                            prevBtn, nextBtn, sourceBtn, closeBtn
                        )
                        await ButtonInteraction.message.edit({
                            components: [row],
                            embeds: [embed]
                        })

                    } else if (id === 'YT_close') {
                        ButtonInteraction.message.delete() // Delete bot embed
                        await message.channel.messages.fetch(authorMessageID).then(message => message.delete()).catch(console.error) // Delete user command call
                        db.delete(`${author.id}.ytstarted`)
                        return
                    }

                    ButtonInteraction.deferUpdate()

                })

            })
        })

    }
}