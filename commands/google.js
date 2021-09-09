const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const googleIt = require("google-it");
const {
    MessageButton
} = require('discord-buttons');

// Regular prefix command handling
module.exports = {
    name: "google",
    description: "Returns Google's top results",
    usage: "?google",
    async execute(client, message, args) {

        if (!args[0]) {
            if (message.content[0] == '?') return message.reply("You must specify a query to search")
            else return
        }

        let query = args.join(" ");
        googleIt({
            'query': query
        }).then(results => {
            // console.log(results)
            // console.log(results.length)

            if (results.length == 0) {
                if (message.content[0] == '?') return message.reply("I couldn't find anything :(")
                else return
            }

            let currInd = 0
            let desc = results[currInd].snippet
            let search = results[currInd].title
            let chosenOneSRC = results[currInd].link
            let embed = new Discord.MessageEmbed()
                .setTitle(`${search}`)
                .setDescription(`${desc}`)
                .setColor(colours.blue_light)
                .setFooter("Buttons will stop working after 1 minute | Page ${currInd + 1}")
                .setTimestamp()

            let nextBtn = new MessageButton()
                .setLabel('Next')
                .setID('find_next')
                .setStyle('blurple')

            let prevBtn = new MessageButton()
                .setLabel('Back')
                .setID('find_prev')
                .setStyle('blurple')
                .setDisabled()

            let closeBtn = new MessageButton()
                .setLabel('Close')
                .setID('find_close')
                .setStyle('red')

            let sourceBtn = new MessageButton()
                .setLabel('Source')
                .setURL(chosenOneSRC)
                .setStyle('url')

            message.channel.send({
                buttons: [prevBtn, nextBtn, sourceBtn, closeBtn],
                embed: embed
            }).then(async (message) => {
                if (currInd >= results.length) return

                const collector = message.createButtonCollector((button) => button.clicker.user.id === author.id, {
                    time: 60000
                })

                collector.on('collect', async (b) => {
                    // console.log(b.id)

                    if (b.id === 'find_next') {
                        prevBtn.disabled = false
                        currInd++
                        let desc = results[currInd].snippet
                        let search = results[currInd].title
                        let chosenOneSRC = results[currInd].link
                        let embed = new Discord.MessageEmbed()
                            .setTitle(`${search}`)
                            .setDescription(`${desc}`)
                            .setColor(colours.blue_light)
                            .setFooter("Buttons will stop working after 1 minute | Page ${currInd + 1}")
                            .setTimestamp()

                        if (currInd == results.length) {
                            nextBtn.disabled = true
                        } else {
                            nextBtn.disabled = false
                        }

                        sourceBtn.setURL(chosenOneSRC)
                        await b.message.edit({
                            buttons: [prevBtn, nextBtn, sourceBtn, closeBtn],
                            embed: embed
                        })

                    } else if (b.id === 'find_prev') {
                        nextBtn.disabled = false
                        currInd--
                        let desc = results[currInd].snippet
                        let search = results[currInd].title
                        let chosenOneSRC = results[currInd].link
                        let embed = new Discord.MessageEmbed()
                            .setTitle(`${search}`)
                            .setDescription(`${desc}`)
                            .setColor(colours.blue_light)
                            .setFooter("Buttons will stop working after 1 minute | Page ${currInd + 1}")
                            .setTimestamp()

                        if (currInd === 0) {
                            prevBtn.disabled = true
                        }

                        sourceBtn.setURL(chosenOneSRC)
                        await b.message.edit({
                            buttons: [prevBtn, nextBtn, sourceBtn, closeBtn],
                            embed: embed
                        })

                    } else if (b.id === 'find_close') {
                        b.message.delete() // Delete bot embed
                        await message.channel.messages.fetch(authorMessageID).then(message => message.delete()).catch(console.error) // Delete user command call
                        db.delete(`${author.id}.findstarted`)
                        b.reply.defer();
                        return
                    }
                    b.reply.defer();

                })

            })



        }).catch(e => {
            console.log(e)
        })

    }
}