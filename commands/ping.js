const Discord = require("discord.js")

module.exports = {
    name: "ping",
    description: "Displays api and bot latency",
    usage: "?ping",
    execute(bot, message, args) {

        message.channel.send("Pinging...").then(m => {
            let ping = m.createdTimestamp - message.createdTimestamp
            let choices = ["Pong!", "Is my ping bad?", "I might be slower today."]
            let response = choices[Math.floor(Math.random() * choices.length)]
    
            m.edit(`${response} Bot Latency: \`${ping}\`, API Latency: \`${Math.round(bot.ping)}\``)
        })

    }
}