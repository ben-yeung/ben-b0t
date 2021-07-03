const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");

module.exports = {
    name: "delete",
    description: "Moderator tool to delete slash commands",
    usage: "?delete [slash command id]",
    execute(bot, message, args) {

        if (!message.member.hasPermission(["ADMINISTRATOR"])) return message.reply("You don't have that permission");
        if (!args[0]) return message.reply("No id given for slash command.")
        let id = args[0]
        try {
            bot.api.applications(bot.user.id).commands(id).delete()
            return message.reply('Slash command has been deleted')
        } catch (e) {
            console.log(e)
            return message.reply('Error occurred see console')
        }

    }
}