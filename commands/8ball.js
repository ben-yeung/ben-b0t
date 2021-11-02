const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");

module.exports = {
    name: "8ball",
    description: "Returns 8ball answer",
    usage: "?8ball [msg]",
    execute(bot, message, args) {
        if (!args[1]) return message.reply("Please ask a complete question!");
        let replies = ['Maybe', 'Yes', 'No', 'Ask again later', 'Definitely Yes', 'I\'m leaning towards no', 'I think so', 'Very doubtful', 'Yessir', 'Negative'];
        let question = args.join(' ');
        let num = Math.floor(Math.random() * replies.length);

        const embed = new Discord.MessageEmbed()
            .setColor(colours.purple_medium)
            .setTitle('Magic :8ball: Oracle')
            .addField('Question: ', question)
            .addField('Answer: ', replies[num])

        message.channel.send({
            embeds: [embed]
        });

    }
}