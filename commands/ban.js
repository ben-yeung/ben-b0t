const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");

module.exports = {
    name: "banuser",
    description: "Bans a given user. Moderator only",
    usage: "?ban [@user]",
    async execute(bot, message, args) {

        if (!message.member.hasPermission(["BAN_MEMBERS"])) return message.reply("Sorry you don't have that permission.");

        const member = message.mentions.users.first();
        let reason = args.slice(1).join(" ");
        if (!reason) reason = "No reason specified."
        if (!args[0]) return message.reply("You must specify a user to ban.")
        if (!member) return message.reply("Member mentioned cannot be found in server.")
        if (!member.bannable()) return message.reply("You can't ban that user")

        const banEmbed = new Discord.MessageEmbed()
            .setTitle(`You have been banned from ${message.guild.name}`)
            .setDescription(`Reason for ban: ${reason}`)
            .setColor(colours.red_dark)
            .setTimestamp();

        await member.send(banEmbed).catch(err => console.log(err));
        await member.ban({
            days: 7,
            reason: reason
        }).catch(err => console.log(err)).then(() => message.channel.send(`${member.user.tag} has been banned.`));
    }
}