const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const {
    Permissions
} = require('discord.js');

module.exports = {
    name: "delete",
    description: "Moderator tool to delete slash commands",
    usage: "?delete [slash command id] [optional: delete global command? Leave blank if false]",
    async execute(bot, message, args) {

        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return message.reply("Sorry, you don't have access to that command.");
        if (!args[0]) return message.reply("No id given for slash command.")
        let id = args[0]
        try {
            if (botconfig.GUILD_ID) { //args[1] true if Guild Testing Command deletion
                console.log("In guild server")
                await bot.api.applications(bot.user.id).guilds(botconfig.GUILD_ID).commands(id).delete()
                return message.reply('Guild Slash command has been deleted')
            } else if (args[1] == 'true') {
                console.log("Not deleting guild command")
                //await bot.api.applications(bot.user.id).commands(id).delete()
                return message.reply('Global Slash command has been deleted')
            }

        } catch (e) {
            console.log(e)
            return message.reply('Error occurred see console')
        }

    }
}