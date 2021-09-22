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
            message.channel.send(
                `${queue.songs
					.map(
						(song, id) =>
							`**${id ? id : 'Playing'}**. ${song.name} - \`${
								song.formattedDuration
							}\``,
					)
					.slice(0, 10)
					.join('\n')}`,
            )
        }
    }
}