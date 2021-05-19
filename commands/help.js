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
            bot.help.delete("twitchclipsauto");
        }

        const comms = Array.from(bot.help.values()).sort();
        var comms2 = [];
        var charCount = 0; //each embed can only have 1024 chars max

        for (var i = 0; i < comms.length; i++) {
            comms[i] = comms[i].replace('?', '');
            charCount += comms[i].length
            if (charCount > 935) { //length of embed chars left accounting for title/desc
                comms2.push(comms[i]);
                comms[i] = '';
            }
            //console.log(`Char count: ${charCount}`)
        }

        // console.log(comms)
        // console.log('\n')
        // console.log(comms2)

        const comms_list = comms.join("\n\n")
        const comms_list2 = comms2.join("\n\n")

        const embed = new Discord.MessageEmbed()
            .setColor(colours.red_light)
            .setTitle('Need assistance? | Page 1')
            .setDescription('Use any of the commands below with prefix: ? \n')
            .addField('Active Commands: ', comms_list);

        if (comms2.length != 0) { // Handles when desc exceeds 1024 characters send new embed to continue
            const embed2 = new Discord.MessageEmbed()
                .setColor(colours.red_light)
                .setTitle('Need assistance? | Page 2')
                .setDescription('Use any of the commands below with prefix: ? \n')
                .addField('Active Commands: ', comms_list2);
            message.author.send(embed2)
        }

        message.react('❤️');
        message.author.send(embed);

    }
}