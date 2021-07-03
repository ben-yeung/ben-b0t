const Discord = require("discord.js")
const colours = require("../colours.json");

module.exports = {
    description: "Displays api and bot latency",
    slash: true,
    testOnly: true, // Guild testing set to false for global
    callback: ({
        client,
        interaction
    }) => {

        let ping = Math.abs(Date.now() - Discord.SnowflakeUtil.deconstruct(interaction.id).timestamp)
        let choices = ["Is my ping bad?", "I might be slower today.", "I forgot to eat breakfast today."]
        let response = choices[Math.floor(Math.random() * choices.length)]
        let embed = new Discord.MessageEmbed()
            .setTitle("Pong :ping_pong:")
            .setDescription(response)
            .addField("Ping", `${ping}ms`, true)
            .addField("API Latency", `${client.ws.ping}ms`, true)
            .setColor(colours.green_light)
            .setTimestamp()

        return embed
    },
}