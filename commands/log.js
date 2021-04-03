const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");

module.exports = {
    name: "log",
    description: "Returns a logged message with message ID",
    usage: "?",
    execute(bot, message, args) {

        if (!args[0]) return message.reply("Please specify a message URL to find the logs for.")

        embedList = bot.logs.get(args[0])
        if (!embedList) return message.reply("Error finding logs for message ID given. Please try again.")
        let embed = embedList[0];
        let currInd = 0;
        let author = message.author

        message.delete()

        message.channel.send(embed).then(message => {
            if (embedList.length == 1) return
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
                    embed = embedList[currInd]
                    message.edit(embed)
                    // react with left arrow if it isn't the start (await is used so that the right arrow always goes after the left)
                    if (currInd !== 0) await message.react('⬅️')
                    // react with right arrow if it isn't the end
                    if (currInd + 1 < embedList.length) message.react('➡️')
                    // react with back to start if isn't start
                    if (currInd !== 0) message.react('↩️')
                })
            })

        })
    }
}