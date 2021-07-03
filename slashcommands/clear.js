const Discord = require("discord.js")
const colours = require("../colours.json");

module.exports = {
    slash: true,
    description: "Clears user's last X messages in current channel",
    testOnly: false, //guild testing when true, set to false for global
    minArgs: 1,
    expectedArgs: '<amount>', //note: have these all lowercased!
    callback: async ({ // put async after 'callback:' for async functions
        client,
        channel,
        interaction,
        args
    }) => {
        const [amount] = args
        if (isNaN(amount)) {
            return 'Given amount is not a valid number!'
        }
        if (amount > 100) return 'You can\'t delete more than 100 messages at once!' // Checks if the `amount` integer is bigger than 100
        if (amount < 1) return 'You have to delete at least 1 message!' // Checks if the `amount` integer is smaller than 1
        await channel.messages.fetch({
            limit: 100
        }).then(messages => { // Fetches the messages
            const filterBy = interaction.member.user.id;
            messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
            channel.bulkDelete(messages, true);
        });

        return 'Nothing to see here...' //use return for slash commands for POST output!
    },
}