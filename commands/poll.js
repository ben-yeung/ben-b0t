const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");

module.exports = {
    name: "poll",
    description: "Creates a yes or no poll. Use ?pollmc for multiple choice",
    usage: "?poll [query]",
    async execute(bot, message, args) {

        if (args.length == 0) {
            return message.reply("You must attach a question to poll!")
        }
        let pollDesc = args.join(' ')

        let embedPoll = new Discord.MessageEmbed()
            .setTitle('📊 Poll Time!')
            .setDescription(pollDesc)
            .setColor('YELLOW')

        let msgEmbed = await message.channel.send(embedPoll);
        await msgEmbed.react('👍')
        await msgEmbed.react('👎')

    }
}