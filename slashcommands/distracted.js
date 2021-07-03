const Discord = require("discord.js")
const colours = require("../colours.json");
const botconfig = require("../botconfig.json");
const canvacord = require("canvacord");

//Credit for regex: https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

module.exports = {
    slash: true,
    description: "Distracted meme. Use @user or image links!",
    testOnly: true, //guild testing when true, set to false for global
    minArgs: 3,
    expectedArgs: '<girl in red> <guy> <jealous girl>', //note: have these all lowercased!
    callback: async ({ // put async after 'callback:' for async functions
        client,
        channel,
        interaction,
        args
    }) => {
        var user1 = interaction.data.options[0].value
        var user2 = interaction.data.options[1].value
        var user3 = interaction.data.options[2].value
        let avatar1 = user1;
        let avatar2 = user2;
        let avatar3 = user3;

        if (!validURL(user1)) {
            try {
                user1 = await client.users.fetch(user1.replace(/[<@!>]/g, ''))
                avatar1 = user1.displayAvatarURL({
                    format: 'png'
                })
            } catch (e) {
                console.log(e)
                return `Invalid URL or invalid mentioned user`
            }

        }
        if (!validURL(user2)) {
            try {
                user2 = await client.users.fetch(user2.replace(/[<@!>]/g, ''))
                avatar2 = user2.displayAvatarURL({
                    format: 'png'
                })
            } catch (e) {
                console.log(e)
                return `Invalid URL or invalid mentioned user`
            }

        }
        if (user3 != undefined && !validURL(user3)) {
            try {
                user3 = await client.users.fetch(user3.replace(/[<@!>]/g, ''))
                avatar3 = user3.displayAvatarURL({
                    format: 'png'
                })
            } catch (e) {
                console.log(e)
                return `Invalid URL or invalid mentioned user`
            }

        }

        try {
            var image;
            if (user3 === undefined) {
                image = await canvacord.Canvas.distracted(avatar1, avatar2);
            } else {
                image = await canvacord.Canvas.distracted(avatar1, avatar2, avatar3);
            }
            let attachment = new Discord.MessageAttachment(image, "concord.png");

            client.reply(interaction, 'Waiting for CanvaCord response...')
            const message = await client.api.webhooks(client.user.id, interaction.token).messages('@original').patch({
                data: {}
            })
            let messageObj = new Discord.Message(client, message, client.channels.cache.get(message.channel_id))
            messageObj.edit("\u200B")
            messageObj.channel.send(attachment)
        } catch (err) {
            console.log(err);
            return `Error occurred. Image URL may be incompatible`
        }
    },
}