const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");

module.exports = {
    name: "avatar",
    description: "Sends profile picture of @'d user",
    usage: "?avatar [@user]",
    execute(bot, message, args) {

        const user = message.mentions.users.first()
        var avatarURL;
        if (!user) {
            user = message.author;
            avatarURL = message.author.displayAvatarURL();
        } else {
            avatarURL = user.displayAvatarURL();
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(`Profile Picture`)
            .setImage(avatarURL)
            .setColor(colours.green_light)
            .setTimestamp()

        message.channel.send(embed);

    }
}