const Discord = require("discord.js")
const colours = require("../colours.json");
const botconfig = require("../botconfig.json");

module.exports = {
    slash: true,
    description: "Create a Yes or No poll!",
    testOnly: false, //guild testing when true, set to false for global
    minArgs: 1,
    expectedArgs: '<statement>', //note: have these all lowercased!
    callback: async ({ // put async after 'callback:' for async functions
        client,
        channel,
        interaction,
        args
    }) => {
        const [desc] = args
        let embedPoll = new Discord.MessageEmbed()
            .setTitle('📊 Poll Time!')
            .setDescription(desc)
            .setColor('YELLOW')

        // Logic for getting a message object to let bot apply reactions
        // Taken from advaith1 dev from https://gist.github.com/advaith1/287e69c3347ef5165c0dbde00aa305d2#gistcomment-3611854

        client.reply(interaction, embedPoll)
        const message = await client.api.webhooks(client.user.id, interaction.token).messages('@original').patch({
            data: {}
        })

        const djsMessage = new Discord.Message(client, message, client.channels.cache.get(message.channel_id))
        await djsMessage.react('👍')
        await djsMessage.react('👎')
        // return 'hello' //use return for slash commands for POST output!


    },
}