const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");

module.exports = {
    name: "help",
    description: "Sends DM to user for list of active commands",
    usage: "?help",
    execute(bot, message, args) {

        const comms = ['8ball [question]', 'ascii [text]', 'calc [expression]', 'cat', 'dog', 'clap [text]', 'vaporwave [text]', 'clear [amount]', 'covid [state/country]', 'decide [choice] or [choice] or ... [choice]', 'def [word]', 'syn [word]', 'find [search]', 'fliptext [text]', 'poll [question]', 'pollmc [choice] or [choice] or ... [choice]', 'rand [min] [max]', 'remind [me/@user] [time] [reminder]', 'tr [language code] [message]', 'trhelp', 'weather [city]', 'userinfo', 'uptime', 'ping'];
        const embed = new Discord.MessageEmbed()
            .setColor(colours.red_light)
            .setTitle('Need assistance?')
            .setDescription('Use any of the commands below with prefix: ? \n Commands with [...] may have options following the command.')
            .addField('Active Commands: ', comms);
        message.react('❤️');
        message.author.send(embed);

    }
}