const Discord = require("discord.js")
const colours = require("../colours.json");
const botconfig = require("../botconfig.json");
var Scraper = require('images-scraper');

var google = new Scraper({
    puppeteer: {
        headless: true
    },
    safe: true
})

module.exports = {
    slash: true,
    description: "Search Google Images for anything! ... for the most part",
    testOnly: false, //guild testing when true, set to false for global
    minArgs: 1,
    expectedArgs: '<query>', //note: have these all lowercased!
    callback: async ({ // put async after 'callback:' for async functions
        client,
        channel,
        interaction,
        args
    }) => {
        const [search] = args
        const author = interaction.member.user

        const intros = ['Searching the web for', 'Scouring the web for', 'Researching scholarly articles for', 'Surfing the web for', 'Checking a picture book for', 'Feeling lucky? Looking for', 'Hey Alexa, what is a', 'Hey Siri, what is a', 'Asking a professor for']
        let choice = intros[Math.floor(Math.random() * intros.length)]

        client.reply(interaction, `${choice} \`${search}\` <a:working:821570743329882172>`)

        const img_res = await google.scrape(search, 5)
        if (!img_res.length) return "No images found with these keywords. It might be NSFW 😳"

        let currInd = 0
        let chosenOne = img_res[currInd].url
        let chosenOneSRC = img_res[currInd].source

        let embed = new Discord.MessageEmbed()
            .setTitle(`Results for '${search}' | Page ${currInd + 1}`)
            .setDescription(`Asker: <@${author.id}> \n [Source](${chosenOneSRC}) \n`)
            .setColor(colours.green_light)
            .setImage(chosenOne)
            .setFooter("Reacts will stop working after 1 minute. React with ❌ to delete query.")

        const message = await client.api.webhooks(client.user.id, interaction.token).messages('@original').patch({
            data: {}
        })

        let messageObj = new Discord.Message(client, message, client.channels.cache.get(message.channel_id))

        messageObj.edit(' ­') //invisible char to make embed edit cleaner
        messageObj.edit(embed).then(async (message) => {
            if (currInd >= img_res.length) return
            await message.react('➡️')
            message.react('❌')

            const collector = message.createReactionCollector(
                // only collect left and right arrow reactions from the message author
                (reaction, user) => ['⬅️', '➡️', '↩️', '❌'].includes(reaction.emoji.name) && user.id === author.id,
                // time out after a minute
                {
                    time: 90000
                }
            )

            collector.on('collect', reaction => {
                // remove the existing reactions
                message.reactions.removeAll().then(async () => {
                    // increase/decrease index
                    if (reaction.emoji.name === '⬅️') {
                        currInd -= 1
                    } else if (reaction.emoji.name === '↩️') {
                        currInd = 0
                    } else if (reaction.emoji.name === '❌') {
                        message.delete() // Delete bot embed
                        message.channel.messages.fetch(authorMessageID).then(message => message.delete()).catch(console.error) // Delete user command call
                        return
                    } else {
                        currInd += 1
                    }
                    // edit message with new embed
                    let chosenOne = img_res[currInd].url
                    let chosenOneSRC = img_res[currInd].source
                    let embed = new Discord.MessageEmbed()
                        .setTitle(`Results for '${search}' | Page ${currInd + 1}`)
                        .setDescription(`Asker: <@${author.id}> \n [Source](${chosenOneSRC}) \n`)
                        .setColor(colours.green_light)
                        .setImage(chosenOne)
                        .setFooter("Reacts will stop working after 1 minute. React with ❌ to delete query.")
                    message.edit(embed)
                    // react with left arrow if it isn't the start (await is used so that the right arrow always goes after the left)
                    if (currInd !== 0) await message.react('⬅️')
                    // react with right arrow if it isn't the end
                    if (currInd + 1 < img_res.length) message.react('➡️')
                    // react with back to start if isn't start
                    if (currInd !== 0) message.react('↩️')
                    // react with x to delete find query
                    message.react('❌')
                })
            })

        })
        return 'Finished'
    },
}