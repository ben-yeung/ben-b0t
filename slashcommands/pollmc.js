const Discord = require("discord.js")
const colours = require("../colours.json");
const botconfig = require("../botconfig.json");

module.exports = {
    slash: true,
    description: "Create a poll with multiple choices!",
    testOnly: false, //guild testing when true, set to false for global
    minArgs: 2,
    expectedArgs: '<choice1> <choice2> [choice3] [choice4] [choice5] [choice6] [choice7] [choice8] [choice9] [choice10]', //note: have these all lowercased!
    callback: async ({ // put async after 'callback:' for async functions
        client,
        channel,
        interaction,
        args
    }) => {
        const choices = args
        console.log(choices)

        let emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']
        let embedPoll = new Discord.MessageEmbed()
            .setTitle('📊 Poll Time!')
            .setDescription('React below with your choice!')
            .setColor('YELLOW');

        var i;
        for (i = 0; i < choices.length; i++) {
            embedPoll.addField('\u200B', `${emojis[i]} ${choices[i]}`)
        }

        // Logic for getting a message object to let bot apply reactions
        // Taken from advaith1 dev from https://gist.github.com/advaith1/287e69c3347ef5165c0dbde00aa305d2#gistcomment-3611854
        client.reply(interaction, embedPoll)
        const message = await client.api.webhooks(client.user.id, interaction.token).messages('@original').patch({
            data: {}
        })

        let msgEmbed = new Discord.Message(client, message, client.channels.cache.get(message.channel_id))
        for (i = 0; i < choices.length; i++) {
            await msgEmbed.react(emojis[i])
        }


    },
}