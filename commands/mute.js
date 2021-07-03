const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const ms = require("ms");

module.exports = {
    name: "mute",
    description: "Mute user",
    usage: "?mute [@user] [time (optional)]",
    async execute(bot, message, args) {

        if (!message.member.hasPermission(["ADMINISTRATOR"])) return message.reply("You don't have that permission");
        message.delete()
        let user = message.guild.member(message.mentions.users.first());
        if (!user) {
            return message.reply("No member found with that name");
        }

        if (user.hasPermission(["MANAGE_MESSAGES"])) return message.reply("Can't mute this person! They are above the law.");

        let role = message.guild.roles.cache.get('720893708429688935');
        let member = message.guild.roles.cache.get('720919936607715382');
        if (!role) return console.log("mute role does not exist");

        let time = args[1]

        if (!time) {
            if (user.roles.cache.has(role.id)) return message.channel.send("The mentioned user is still muted.");
            await (user.roles.add(role.id).catch(err => message.channel.send(`Something went wrong adding ban role: ${err}`)))
            await (user.roles.remove(member.id).catch(err => message.channel.send(`Something went wrong removing member role: ${err}`)))
            return message.channel.send(`${user.displayName} is now muted.`);
        } else {
            if (user.roles.cache.has(role.id)) return message.channel.send("The mentioned user is still muted.");
            await (user.roles.add(role.id).catch(err => message.channel.send(`Something went wrong adding ban role: ${err}`)))
            await (user.roles.remove(member.id).catch(err => message.channel.send(`Something went wrong removing member role: ${err}`)))

            let timer = setTimeout(function () {
                user.roles.remove(role.id).catch(err => message.channel.send(`Something went wrong: ${err}`));
                user.roles.add(member.id).catch(err => message.channel.send(`Something went wrong adding ban role: ${err}`));
                message.channel.send(`${user.displayName} is now unmuted.`);
            }, ms(time))

            bot.mute.set(user.user.id, timer);
            message.channel.send(`${user.displayName} is now muted for **${ms(ms(time))}**`);
        }

    }
}