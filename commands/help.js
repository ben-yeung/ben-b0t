const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const {
    MessageButton
} = require('discord-buttons');

module.exports = {
    name: "help",
    description: "Sends DM to user for list of active commands",
    usage: "?help",
    execute(bot, message, args) {

        bot.help.delete("banuser"); //delete moderator commands from help list
        bot.help.delete("kickuser");
        bot.help.delete("mute");
        bot.help.delete("unmute");
        bot.help.delete("modclear");
        bot.help.delete("setnick");
        bot.help.delete("setstatus");
        bot.help.delete("unban");
        bot.help.delete("test");
        bot.help.delete("sd");
        bot.help.delete("say");
        bot.help.delete("twitchclipsauto");
        bot.help.delete("delete")

        var pages = {};
        var c = 1;
        pages[c] = [];

        const comms = Array.from(bot.help.values()).sort();
        var charCount = 0; //each embed can only have 1024 chars max

        for (var i = 0; i < comms.length; i++) {
            if (charCount > 935) { //length of embed chars left accounting for title/desc
                c += 1;
                pages[c] = [];
                charCount = 0;
            }
            pages[c].push(comms[i].replace('?', ''));
            charCount += comms[i].length
        }

        var embeds = [];
        for (var i = 0; i < Object.keys(pages).length; i++) {
            let embed = new Discord.MessageEmbed()
                .setColor(colours.red_light)
                .setTitle(`Need assistance? | Page ${i}`)
                .setDescription('Use any of the commands below with prefix: ? \n')
                .addField('Active Commands: ', pages[i].join("\n\n"))
                .setFooter("Buttons will stop working after 1 minute.")

            embeds.push(embed);
        }

        let nextBtn = new MessageButton()
            .setLabel('Next')
            .setID('find_next')
            .setStyle('blurple')

        let prevBtn = new MessageButton()
            .setLabel('Back')
            .setID('find_prev')
            .setStyle('blurple')
            .setDisabled()

        var currInd = 1;
        const author = message.author;

        message.react('❤️');
        message.author.send({
            buttons: [prevBtn, nextBtn],
            embed: embeds[0]
        }).then(async (message) => {
            if (currInd >= embeds.length) return

            const collector = message.createButtonCollector((button) => button.clicker.user.id === author.id, {
                time: 60000
            })

            collector.on('collect', async (b) => {
                // console.log(b.id)

                if (b.id === 'find_next') {
                    prevBtn.disabled = false
                    currInd++
                    let embed = embeds[currInd - 1]

                    if (currInd >= img_res.length) {
                        nextBtn.disabled = true
                    } else {
                        nextBtn.disabled = false
                    }
                    await b.message.edit({
                        buttons: [prevBtn, nextBtn],
                        embed: embed
                    })

                } else if (b.id === 'find_prev') {
                    nextBtn.disabled = false
                    currInd--
                    let embed = embeds[currInd - 1]

                    if (currInd >= img_res.length) {
                        nextBtn.disabled = true
                    } else {
                        nextBtn.disabled = false
                    }
                    await b.message.edit({
                        buttons: [prevBtn, nextBtn],
                        embed: embed
                    })

                    if (currInd === 1) {
                        prevBtn.disabled = true
                    }

                    await b.message.edit({
                        buttons: [prevBtn, nextBtn],
                        embed: embed
                    })

                }
                b.reply.defer();

            })

        });

    }
}