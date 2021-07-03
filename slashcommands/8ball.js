const Discord = require("discord.js")
const colours = require("../colours.json");

module.exports = {
    slash: true,
    description: "The Magic 8 Ball Oracle has answer to all the questions.",
    testOnly: false, //guild testing when true, set to false for global
    minArgs: 1,
    expectedArgs: '<question>', //note: have these all lowercased!
    callback: ({ //see https://docs.wornoffkeys.com/commands/commands for more command properties
        client,
        channel,
        interaction,
        args
    }) => {
        const [question] = args
        let replies = ['Maybe', 'Yes', 'No', 'Ask again later', 'Definitely Yes', 'I\'m leaning towards no', 'I think so', 'Very doubtful', 'Yessir', 'Negative'];
        let num = Math.floor(Math.random() * replies.length);

        const embed = new Discord.MessageEmbed()
            .setColor(colours.purple_medium)
            .setTitle('Magic :8ball: Oracle')
            .addField('Question: ', question)
            .addField('Answer: ', replies[num])

        return embed
    },
}