const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
var Scraper = require('images-scraper');

var google = new Scraper({
    puppeteer: {
        headless: true
    },
    safe: true
})

module.exports = {
    name: "find",
    description: "Returns results for Google Image search",
    usage: "?find [query]",
    async execute(bot, message, args) {

        let search = args.join(" ");
        if (!search) return message.reply("Please enter a search query")

        const author = message.author
        const img_res = await google.scrape(search, 5)
        console.log(img_res)
        console.log("\n----------------------------------------")
        if (!img_res.length) return message.channel.send("No images found with these keywords. It might be NSFW 😳")

        let currInd = 0
        let chosenOne = img_res[currInd].url
        let chosenOneSRC = img_res[currInd].source

        let embed = new Discord.MessageEmbed()
            .setTitle(`Results for '${search}' | Page ${currInd + 1}`)
            .setDescription(`Reacts must be from Asker and reacts will stop working \nafter 1 minute. \n\n Asker: <@${author.id}> \n [Source](${chosenOneSRC}) \n`)
            .setColor(colours.green_light)
            .setImage(chosenOne)

        message.channel.send(embed).then(message => {
            if (currInd >= img_res.length) return
            message.react('➡️')

            const collector = message.createReactionCollector(
                // only collect left and right arrow reactions from the message author
                (reaction, user) => ['⬅️', '➡️', '↩️'].includes(reaction.emoji.name) && user.id === author.id,
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
                    } else {
                        currInd += 1
                    }
                    // edit message with new embed
                    let chosenOne = img_res[currInd].url
                    let chosenOneSRC = img_res[currInd].source
                    let embed = new Discord.MessageEmbed()
                        .setTitle(`Results for '${search}' | Page ${currInd + 1}`)
                        .setDescription(`Reacts must be from Asker and reacts will stop working \nafter 1 minute.\n\n Asker: <@${author.id}> \n [Source](${chosenOneSRC}) \n`)
                        .setColor(colours.green_light)
                        .setImage(chosenOne)
                    message.edit(embed)
                    // react with left arrow if it isn't the start (await is used so that the right arrow always goes after the left)
                    if (currInd !== 0) await message.react('⬅️')
                    // react with right arrow if it isn't the end
                    if (currInd + 1 < img_res.length) message.react('➡️')
                    // react with back to start if isn't start
                    if (currInd !== 0) message.react('↩️')
                })
            })

        })

    }
}