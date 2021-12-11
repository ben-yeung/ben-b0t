const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");

// Regular prefix command handling
module.exports = {
    name: "queue",
    description: "Returns the current queue",
    usage: "?queue",
    execute(client, message, args) {

        const queue = client.distube.getQueue(message)
        if (!queue) {
            message.channel.send('Nothing playing right now!')
        } else {
            const list = `${queue.songs
                .map(
                    (song, id) =>
                        `**${id ? id : 'Playing'}**: ${song.name} - \`${
                            song.formattedDuration
                        }\``,
                )
                .slice(0, 10)
                .join('\n')}`

            let embed = new Discord.MessageEmbed()
                .setTitle("Current Queue")
                .setDescription(list)
                .setThumbnail("https://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c545.png")
                .setColor("RED")
                .setTimestamp()
            message.channel.send({
                embeds: [embed]
            })
        }
    }
}