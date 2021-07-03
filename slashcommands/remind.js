const Discord = require("discord.js")
const colours = require("../colours.json");
const botconfig = require("../botconfig.json");
const ms = require('ms');

module.exports = {
    slash: true,
    description: "Create a reminder for a user or for yourself!",
    testOnly: false, //guild testing when true, set to false for global
    minArgs: 3,
    expectedArgs: '<user> <task> <time>', //note: have these all lowercased!
    callback: async ({ // put async after 'callback:' for async functions
        client,
        channel,
        interaction,
        args
    }) => {
        var [user, task, time] = args
        if (user === 'me') {
            user = interaction.member.user
        } else {
            userid = interaction.data.options[0].value.replace(/[<@!>]/g, '')
            try {
                user = await client.users.fetch(userid)
            } catch (e) {
                console.log(e)
            }
        }

        if (ms(time) == undefined) return "You must specify an amount of time! EX: 30m. Make sure number and time variant (min/hr/day) is not separated."

        let timer = setTimeout(function () {
            channel.send(`**Reminder** <@${user.id}>: ${task}`)
        }, ms(time))

        client.reminders.set(user.id, timer)
        return `I will remind <@${user.id}> to ${task} in **${ms(ms(time))}**`
    },
}