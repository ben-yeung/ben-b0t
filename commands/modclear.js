const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");

module.exports = {
    name: "modclear",
    description: "Clear that clears all recent x messages",
    usage: "?modclear [@user (optional)] [number]",
    async execute(bot, message, args) {

        if (!message.member.hasPermission(["MANAGE_MESSAGES", "ADMINISTRATOR"])) {
            return message.reply("Sorry you don't have that permission.");
        }
        if (args.length == 2) {
            let user = message.guild.member(message.mentions.users.first());
            const amount = parseInt(args[1]) + 1;
            if (isNaN(amount)) {
                return message.reply("Command follows the format: ?modclear [user (optional)] [amount]")
            }
            if (amount > 100) return message.reply('You can\'t delete more than 100 messages at once!'); // Checks if the `amount` integer is bigger than 100
            if (amount < 1) return message.reply('You have to delete at least 1 message!'); // Checks if the `amount` integer is smaller than 1

            try {
                await message.channel.messages.fetch({
                    limit: 100
                }).then(messages => { // Fetches the messages
                    const filterBy = user.user.id;
                    messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
                    message.channel.bulkDelete(messages);
                });
            } catch (e) {
                message.channel.send(`ERROR: ${e.message}`)
            }


        } else if (args.length == 1) {
            const amount = parseInt(args[0]) + 1;
            if (isNaN(amount)) {
                return message.reply("Command follows the format: ?modclear [user (optional)] [amount]")
            }
            if (amount > 100) return message.reply('You can\'t delete more than 100 messages at once!'); // Checks if the `amount` integer is bigger than 100
            if (amount < 1) return message.reply('You have to delete at least 1 message!'); // Checks if the `amount` integer is smaller than 1

            try {
                await message.channel.messages.fetch({
                    limit: 100
                }).then(messages => { // Fetches the messages
                    messages = messages.array().slice(0, amount);
                    message.channel.bulkDelete(messages, true);
                });

            } catch (e) {
                message.channel.send(`ERROR: ${e.message}`)
            }
        } else {
            return message.reply("Command follows the format: ?modclear [user (optional)] [amount]")
        }

    }
}