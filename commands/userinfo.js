const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");

module.exports = {
    name: "userinfo",
    description: "Gets userinfo",
    usage: "?userinfo [@user]",
    async execute(bot, message, args) {

        var member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) {
            member = message.member
        }

        // removing roles that are not relevant (role dividers)
        const excludedRoles = ['821543047832797214', '821544278063972372', '821543454654857247']
        var roles = member.roles.cache.map(r => r).filter(role => !excludedRoles.includes(role.id)).join(" ").replace("@everyone", "") || "None"

        const embed = new Discord.MessageEmbed()
            .setTitle(`${member.user.tag}`)
            .setThumbnail(member.user.avatarURL({
                dynamic: true,
                size: 512
            }))
            .addField("Roles", `${roles}`, true)
            .addField('Member Since ', `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`)
            .addField("Account Created", `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`, true)
            .setColor(colours.cyan)
            .setFooter(`ID: ${member.user.id} | Status: ${member.presence.status}`)

        message.channel.send({
            embeds: [embed]
        });

    }
}