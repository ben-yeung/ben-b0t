const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");

module.exports = {
    name: "unban",
    description: "Unbans a given user ID. Moderator only",
    usage: "?unban",
    execute(bot, message, args) {

        if (!message.member.hasPermission(["BAN_MEMBERS"])) return message.reply("Sorry you don't have that permission.");

        if (!args[0]) return message.reply("You must specify a user ID to unban");
        let userID = args[0];
        if (isNaN(parseInt(userID))) return message.reply("You must specify a user ID to unban");
        let reason = "Unban granted."

        message.guild.fetchBans().then(async bans => {
            if (bans.size == 0) return message.reply("There are currently no users banned on this server.");
            let bannedUser = bans.find(b => b.user.id == userID);
            if (!bannedUser) return message.reply("The given user ID is not banned.");
            await message.guild.members.unban(bannedUser.user, reason).catch(err => {
                console.log(err);
                return message.reply("Error when unbanning the given id.");
            }).then(() => {
                message.channel.send(`User has been unbanned.`)
            })
        })

    }
}