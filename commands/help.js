const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const {
    MessageButton,
    MessageActionRow
} = require('discord.js');

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
        var c = 0;
        pages[c] = [];

        const comms = Array.from(bot.help.values()).sort();
        var charCount = 0; //each embed can only have 1024 chars max

        for (var i = 0; i < comms.length; i++) {
            if (charCount > 400) { //Char limit for each page
                c += 1;
                pages[c] = [];
                charCount = 0;
            }
            pages[c].push(comms[i].replace('?', ''));
            charCount += comms[i].length
        }

        //console.log(pages);

        var embeds = [];
        for (var i = 0; i < Object.keys(pages).length; i++) {
            let embed = new Discord.MessageEmbed()
                .setColor(colours.red_light)
                .setTitle(`Need assistance? | Page ${i + 1}`)
                .setDescription('Use any of the commands below with prefix: ? \n')
                .addField('Active Commands: ', pages[i].join("\n\n"))
                .setFooter("Buttons will stop working after 1 minute.")

            embeds.push(embed);
        }

        const nextBtn = new MessageButton()
            .setLabel('Next')
            .setCustomId('help_next')
            .setStyle('PRIMARY')

        const prevBtn = new MessageButton()
            .setLabel('Prev')
            .setCustomId('help_prev')
            .setStyle('PRIMARY')

        const row = new MessageActionRow().addComponents(
            nextBtn, prevBtn
        )

        var currInd = 0;
        const author = message.author;

        message.react('❤️');
        message.author.send({
            components: [row],
            embeds: [embeds[0]]
        }).then(async (message) => {
            if (currInd >= embeds.length) return

            const filter = (btn) => {
                return author.id === btn.user.id
            }

            const collector = message.channel.createMessageComponentCollector({
                filter,
                time: 120000
            })

            collector.on('collect', async (ButtonInteraction) => {
                //console.log(ButtonInteraction.customId)
                const id = ButtonInteraction.customId
                if (id === 'help_next') {
                    prevBtn.disabled = false
                    currInd++
                    let embed = embeds[currInd]

                    if (currInd + 1 == embeds.length) {
                        nextBtn.disabled = true
                    } else {
                        nextBtn.disabled = false
                    }
                    const row = new MessageActionRow().setComponents(
                        nextBtn, prevBtn
                    )
                    await ButtonInteraction.message.edit({
                        components: [row],
                        embeds: [embed]
                    })

                } else if (id === 'help_prev') {
                    nextBtn.disabled = false
                    currInd--
                    let embed = embeds[currInd]

                    if (currInd === 0) {
                        prevBtn.disabled = true
                    }
                    const row = new MessageActionRow().setComponents(
                        nextBtn, prevBtn
                    )
                    await ButtonInteraction.message.edit({
                        components: [row],
                        embeds: [embed]
                    })

                }

                ButtonInteraction.deferUpdate()
            })
        })
    }
}