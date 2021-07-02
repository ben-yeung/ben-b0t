const Discord = require("discord.js")
const colours = require("../colours.json");

module.exports = {
    name: "ping",
    description: "Displays api and bot latency",
    usage: "?ping",
    slash: 'both',
    execute(bot, message, args) {
        let ping = message.createdTimestamp - message.createdTimestamp
        let choices = ["Is my ping bad?", "I might be slower today.", "I forgot to eat breakfast today."]
        let response = choices[Math.floor(Math.random() * choices.length)]

        let embed = new Discord.MessageEmbed()
            .setTitle("Pong :ping_pong:")
            .setDescription(response)
            .addField("Ping", `${ping}ms`, true)
            .addField("API Latency", `${bot.ws.ping}ms`, true)
            .setColor(colours.green_light)
            .setTimestamp()

        // if (message) {
        //     message.channel.send("Pinging...").then(m => {
        //         m.edit(embed)
        //     })
        // }
        return embed

    }
}