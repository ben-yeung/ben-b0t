const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const math = require('mathjs');

module.exports = {
    name: "calc",
    description: "Calculate given input",
    usage: "?calc",
    execute(bot, message, args) {

        if (!args[0]) return message.reply("Please input a math problem");

        let resp;
        try {
            if (args.join(' ').toLowerCase().includes('life')) {
                resp = "The meaning of life, or the answer to the question: \"What is the meaning of life?\", pertains to the significance of living or existence in general. Many other related questions include: \"Why are we here?\", \"What is life all about?\", or \"What is the purpose of existence?\" ";
            } else {
                resp = math.evaluate(args.join(' '));
            }
        } catch (e) {
            return message.channel.send("Sorry I couldn't compute that. It may not be a valid calculation. Check for typos!");
        }
        const embed = new Discord.MessageEmbed()
            .setColor(colours.blue_light)
            .setTitle('According to my calculations...')
            .addField('**Input**', `\`\`\`\n${args.join(' ')}\`\`\``)
            .addField('**Output**', `\`\`\`\n${resp}\`\`\``)

        message.channel.send(embed);

    }
}