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

        await message.channel.messages.fetch({
            limit: 100
        }).then(messages => { // Fetches the messages
            const filterBy = message.author.id;
            messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
            message.channel.bulkDelete(messages, true);
        });

    }
}