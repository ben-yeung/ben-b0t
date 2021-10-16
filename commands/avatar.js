const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");

module.exports = {
    name: "avatar",
    description: "Sends profile picture of @'d user",
    usage: "?avatar [@user]",
    execute(client, message, args) {

        const user = message.mentions.users.first() || message.author;
        const avatarURL = user.avatarURL({
            dynamic: true,
            size: 256
        });

        let embed = new Discord.MessageEmbed()
            .setTitle(`${user.username}'s Profile Picture`)
            .setImage(avatarURL)
            .setColor(colours.green_light)
            .setTimestamp()

        message.channel.send({
            embeds: [embed]
        });

    }
}