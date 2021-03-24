const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const ms = require('ms');

module.exports = {
    name: "remind",
    description: "Create reminders for self or others",
    usage: "?remind [@user/me] [time] [msg]",
    execute(bot, message, args) {

        let user = message.guild.member(message.mentions.users.first());
        if (args[0].localeCompare("me") == 0) {
            user = message.guild.member(message.author)
        } else if (!user) {
            return message.reply("You must specify who I should remind! Use 'me' or '@' someone")
        }
        if (!args[2]) {
            return message.reply("You need to tell me what you want to be reminded to do!")
        }

        let time = args[1]
        if (!time) {
            return message.reply("You must specify an amount of time! EX: 30m Make sure number and time variant (min/hr/day) is not separated.")
        } else {
            let task = args.splice(2).join(" ");

            if (ms(time) == undefined) return message.reply("You must specify an amount of time! EX: 30m Make sure number and time variant (min/hr/day) is not separated.")

            let timer = setTimeout(function () {
                message.channel.send(`**Reminder** <@${user.id}>: ${task}`)
            }, ms(time))

            bot.reminders.set(user.user.id, timer)
            message.channel.send(`I will remind <@${user.id}> to ${task} in **${ms(ms(time))}**`)

        }

    }
}