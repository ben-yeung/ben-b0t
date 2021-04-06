const Discord = require("discord.js")
const colours = require("../colours.json");

module.exports = {
    name: "ping",
    description: "Displays api and bot latency",
    usage: "?ping",
    execute(bot, message, args) {

        message.channel.send("Pinging...").then(m => {
            let ping = m.createdTimestamp - message.createdTimestamp
            let choices = ["Is my ping bad?", "I might be slower today.", "I forgot to eat breakfast today."]
            let response = choices[Math.floor(Math.random() * choices.length)]

            let embed = new Discord.MessageEmbed()
                .setTitle("Pong :ping_pong:")
                .setDescription(response)
                .addField("Ping", `${ping}ms`, true)
                .addField("API Latency", `${bot.ws.ping}ms`, true)
                .setColor(colours.green_light)
                .setTimestamp()

            m.edit(embed)
        })

    }
}