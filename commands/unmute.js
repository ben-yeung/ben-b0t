const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");

module.exports = {
    name: "unmute",
    description: "Unmute user",
    usage: "?unmute [@user]",
    async execute(bot, message, args) {

        if (!message.member.hasPermission("MANAGE_MESSAGES") || !message.member.hasPermission("MUTE_MEMBERS") || !message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send("You don't have the perms to do that m8.");
        }

        let user = message.guild.member(message.mentions.users.first());
        if (!user) return message.channel.send("You need to mention the user.");

        let role = message.guild.roles.cache.get('720893708429688935');
        let member = message.guild.roles.cache.get('720919936607715382');
        if (!role) return message.channel.send("Couldn't find the mute role.");

        if (!user.roles.cache.find(r => r.name === "muted")) return message.channel.send("The mentioned user is not muted.");

        await user.roles.remove(role.id).catch(err => message.channel.send(`Something went wrong: ${err}`));
        await (user.roles.add(member.id).catch(err => message.channel.send(`Something went wrong adding member role: ${err}`)))
        await clearTimeout(bot.mute.get(user.user.id));
        await bot.mute.delete(user.user.id);
        await message.channel.send(`${user.displayName} is now unmuted.`);

    }
}