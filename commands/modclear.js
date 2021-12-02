const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const {
    Permissions
} = require('discord.js');

module.exports = {
    name: "modclear",
    description: "Clear that clears all recent x messages",
    usage: "?modclear [optional: @user] [amount]",
    async execute(bot, message, args) {

        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return message.reply("Sorry, you don't have access to that command.");

        if (args.length == 2) {
            let user = message.mentions.users.first()
            if (!user) return message.reply("No user found/mentioned. ?modclear [optional: @user] [amount]")
            const amount = parseInt(args[1]) + 1;
            if (isNaN(amount)) {
                return message.reply("Command follows the format: ?modclear [optional: @user] [amount]")
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
                        if (count < amount && msg.author.id == user.id) {
                            toDelete.push(msg);
                            count += 1
                        }
                    })
                })

                message.channel.bulkDelete(toDelete, true);
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
                const toDelete = []
                var count = 0;
                await message.channel.messages.fetch({
                    limit: 100
                }).then(async (messages) => {
                    messages.filter((msg) => {
                        if (count < amount) {
                            toDelete.push(msg);
                            count += 1
                        }
                    })
                })

                message.channel.bulkDelete(toDelete, true);

            } catch (e) {
                message.channel.send(`ERROR: ${e.message}`)
            }
        } else {
            return message.reply("Command follows the format: ?modclear [user (optional)] [amount]")
        }

    }
}