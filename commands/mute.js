const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const ms = require("ms");
const {
    Permissions
} = require('discord.js');

module.exports = {
    name: "mute",
    description: "Mute user",
    usage: "?mute [@user] [time (optional)]",
    async execute(bot, message, args) {

        if (!message.member.permissions.has(Permissions.FLAGS.MUTE_MEMBERS)) return message.reply("Sorry, you don't have access to that command.");
        message.delete()
        let user = message.guild.members.cache.get(message.mentions.users.first().id);
        if (!user) {
            return message.reply("No member found with that name");
        }

        if (user.permissions.has(Permissions.FLAGS.MUTE_MEMBERS)) return message.reply("Can't mute this person! They are above the law.");

        // The idea is that we take away the member role (general permissions)
        // and add the mute role in order to prevent chatting / indicate user is muted
        let role = message.guild.roles.cache.get('720893708429688935'); // id of mute role
        let member = message.guild.roles.cache.get('720919936607715382'); // id of member role
        if (!role) return console.log("mute role does not exist");

        let time = args[1]

        if (!time) {
            if (user.roles.cache.has(role.id)) return message.channel.send("The mentioned user is still muted.");
            await (user.roles.add(role.id).catch(err => message.channel.send(`Something went wrong adding ban role: ${err}`)))
            await (user.roles.remove(member.id).catch(err => message.channel.send(`Something went wrong removing member role: ${err}`)))
            return message.channel.send(`<@${user.id}> is now muted.`);
        } else {
            if (user.roles.cache.has(role.id)) return message.channel.send("The mentioned user is still muted.");
            await (user.roles.add(role.id).catch(err => message.channel.send(`Something went wrong adding ban role: ${err}`)))
            await (user.roles.remove(member.id).catch(err => message.channel.send(`Something went wrong removing member role: ${err}`)))

            let timer = setTimeout(function () {
                user.roles.remove(role.id).catch(err => message.channel.send(`Something went wrong: ${err}`));
                user.roles.add(member.id).catch(err => message.channel.send(`Something went wrong adding ban role: ${err}`));
                message.channel.send(`<@${user.id}> is now unmuted.`);
            }, ms(time))

            bot.mute.set(user.user.id, timer);
            message.channel.send(`<@${user.id}> is now muted for **${ms(ms(time))}**`);
        }

    }
}