const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");

module.exports = {
    name: "clear",
    description: "Clears user's last x messages",
    usage: "?clear [number]",
    async execute(bot, message, args) {

        const amount = parseInt(args[0]) + 1;
        if (isNaN(amount)) {
            return message.reply("Command follows the format: ?clear [amount]")
        }
        if (amount > 100) return message.reply('You can\'t delete more than 100 messages at once!'); // Checks if the `amount` integer is bigger than 100
        if (amount < 1) return message.reply('You have to delete at least 1 message!'); // Checks if the `amount` integer is smaller than 1

        try {
            const toDelete = []
            var count = 0;
            await message.channel.messages.fetch({
                limit: 100
            }).then(async (messages) => {
                messages.filter((msg) => {
                    if (count < amount && msg.author.id == message.author.id) {
                        toDelete.push(msg);
                        count += 1
                    }
                })
            })

            message.channel.bulkDelete(toDelete, true);
        } catch (e) {
            console.log(e)
        }

    }
}