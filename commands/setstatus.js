const Discord = require("discord.js")

module.exports = {
    name: "setstatus",
    description: "Set bot status",
    usage: "?setstatus [activity] [desc]",
    execute(bot, message, args) {

        if (!message.member.hasPermission(["MANAGE_MESSAGES", "ADMINISTRATOR"])) return message.channel.send("You can not use this command!")
        let activities = ["PLAYING", "WATCHING", "LISTENING", "STREAMING"];
        if (activities.some(word => args[0].includes(word))) {
            let words = args.splice(1).join(" ");
            bot.user.setActivity(words, {
                type: args[0]
            })
        } else {
            message.channel.send("Illegal operands. Possible activity types: PLAYING, WATCHING, LISTENING, STREAMING");
        }

    }
}