const Discord = require("discord.js")
const colours = require("../colours.json");
const math = require('mathjs');

module.exports = {
    slash: true,
    description: "Calculates a given expression",
    testOnly: true, //guild testing when true, set to false for global
    minArgs: 1,
    expectedArgs: '<expression>', //note: have these all lowercased!
    callback: ({ // put async after 'callback:' for async functions
        client,
        channel,
        interaction,
        args
    }) => {
        const [expr] = args

        let resp;
        try {
            if (args.join(' ').toLowerCase().includes('life')) {
                resp = "The meaning of life, or the answer to the question: \"What is the meaning of life?\", pertains to the significance of living or existence in general. Many other related questions include: \"Why are we here?\", \"What is life all about?\", or \"What is the purpose of existence?\" ";
            } else {
                resp = math.evaluate(args.join(' '));
            }
            const embed = new Discord.MessageEmbed()
                .setColor(colours.blue_light)
                .setTitle('According to my calculations...')
                .addField('**Input**', `\`\`\`\n${args.join(' ')}\`\`\``)
                .addField('**Output**', `\`\`\`\n${resp}\`\`\``)

            return embed
        } catch (e) {
            console.log(e)
        }

        return 'Sorry I had trouble reading that. Please check the given expression.'
    },
}