const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");

module.exports = {
    name: "help",
    description: "Sends DM to user for list of active commands",
    usage: "?help",
    execute(bot, message, args) {

        if (bot.help.get('banuser')) {
            bot.help.delete("banuser"); //delete moderator commands from help list
            bot.help.delete("kickuser");
            bot.help.delete("mute");
            bot.help.delete("unmute");
            bot.help.delete("modclear");
            bot.help.delete("setnick");
            bot.help.delete("setstatus");
            bot.help.delete("unban");
            bot.help.delete("test");
            bot.help.delete("sd");
            bot.help.delete("say");
            bot.help.delete("twitchclips");
        }

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