const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");

module.exports = {
    name: "help",
    description: "Sends DM to user for list of active commands",
    usage: "?help",
    execute(bot, message, args) {

        const comms = Array.from(bot.help.values()).sort();

        for (var i = 0; i < comms.length; i++) {
            comms[i] = comms[i].replace('?', '');
        }

        const comms_list = comms.join("\n\n")
        const embed = new Discord.MessageEmbed()
            .setColor(colours.red_light)
            .setTitle('Need assistance?')
            .setDescription('Use any of the commands below with prefix: ? \n Commands with [...] may have options following the command.')
            .addField('Active Commands: ', comms_list);
        message.react('❤️');
        message.author.send(embed);

    }
}