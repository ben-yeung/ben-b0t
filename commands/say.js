const Discord = require("discord.js")

module.exports = {
    name: "say",
    description: "Makes bot say a message in a channel",
    usage: "?say [#channel] [msg]",
    execute(bot, message, args) {

        if (!message.member.hasPermission(["MANAGE_MESSAGES", "ADMINISTRATOR"])) return message.channel.send("You can not use this command!")

        let argsresult;
        let mChannel = message.mentions.channels.first()

        if (message.channel.id != '701976025357090816') {
            message.delete()
        }
        if (mChannel) {
            argsresult = args.slice(1).join(" ")
            mChannel.send(argsresult)
        } else {
            argsresult = args.join(" ")
            message.channel.send(argsresult)
        }

    }
}