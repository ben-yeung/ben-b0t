const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const ytsr = require("ytsr");

module.exports = {
    name: "yt",
    description: "Searches YouTube and sends Video details",
    usage: "?yt [query]",
    async execute(bot, message, args) {

        const query = args.join(" ");
        if (!query) {
            return message.reply("Must provide a search query!")
        }

        const res = await ytsr(query).catch(e => {
            console.log(e)
            return message.reply("No results found.")
        });

        const results = res.items.filter(i => i.type == "video");
        let video = results[0];
        if (!video) {
            return message.reply("No results found.")
        }

        var currInd = 0;
        const author = message.author;

        const embed = new Discord.MessageEmbed()
            .setTitle(video.title)
            .setImage(video.bestThumbnail.url)
            .setColor("RED")
            .setDescription(`** [${video.url}](${video.url}) **`)
            .addField("Views", video.views.toLocaleString(), true)
            .addField("Duration", video.duration, true)

        message.channel.send({
            embeds: [embed]
        }).then(message => {
            if (currInd >= results.length) return
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
                    let video = results[currInd]
                    let embed = new Discord.MessageEmbed()
                        .setTitle(video.title)
                        .setImage(video.bestThumbnail.url)
                        .setColor("RED")
                        .setDescription(`React functionality expires in 1 minute \n** [${video.url}](${video.url}) **`)
                        .addField("Views", video.views.toLocaleString(), true)
                        .addField("Duration", video.duration, true)
                    message.edit(embed)
                    // react with left arrow if it isn't the start (await is used so that the right arrow always goes after the left)
                    if (currInd !== 0) await message.react('⬅️')
                    // react with right arrow if it isn't the end
                    if (currInd + 1 < results.length) message.react('➡️')
                    // react with back to start if isn't start
                    if (currInd !== 0) message.react('↩️')
                })
            })

        })

    }
}