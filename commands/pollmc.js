const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");

module.exports = {
    name: "pollmc",
    description: "Creates a poll with multiple choice (Max 10 choices)",
    usage: "?pollmc [choice] or [choice] or ... [choice]",
    async execute(bot, message, args) {

        if (args.indexOf("or") < 0) {
            return message.reply("The format is: ```?pollmc choice or choice or choice etc... with a maximum of 10 choices.```")
        }

        let orCount = 0
        var i;
        for (i = 0; i < args.length; i++) {
            if (args[i].localeCompare("or") == 0) {
                orCount++
            }
        }
        console.log(orCount)
        if (orCount > 9) {
            return message.reply("Too many choices inputted!")
        }

        let choices = new Array(orCount + 1)
        let ind = 0
        var c;
        let game = ""
        for (c = 0; c < args.length; c++) {
            if (args[c].localeCompare("or") != 0) {
                game += args[c] + " "
                if (c == args.length - 1) {
                    choices[ind] = game
                    break;
                }
            } else {
                choices[ind] = game
                ind++
                game = ""
            }
        }
        let emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']
        console.log(choices)
        let pollEmbed = new Discord.MessageEmbed()
            .setTitle('📊 Poll Time!')
            .setDescription('React below with your choice!')
            .setColor('YELLOW');

        var i;
        for (i = 0; i < choices.length; i++) {
            pollEmbed.addField('\u200B', `${emojis[i]} ${choices[i]}`)
        }
        let msgEmbed = await message.channel.send(pollEmbed);
        for (i = 0; i < choices.length; i++) {
            await msgEmbed.react(emojis[i])
        }

    }
}