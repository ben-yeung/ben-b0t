const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const {
    MessageAttachment
} = require('discord.js')

module.exports = {
    name: "serverinfo",
    description: "Displays serverinfo",
    usage: "?serverinfo",
    execute(bot, message, args) {

        let sEmbed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`${message.guild}`)
            .setThumbnail(message.guild.iconURL())
            .addField("Owner", `The owner of this server is <@281914815235227658>`)
            .addField("Member Count", `This server has ${message.guild.memberCount} members`)
            .addField("Emoji Count", `This server has ${message.guild.emojis.cache.size} emojis`)
            .addField("Roles Count", `This server has ${message.guild.roles.cache.size} roles`)
        message.channel.send(sEmbed);

    }
}