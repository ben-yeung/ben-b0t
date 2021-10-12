const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const fetchRT = require("rottentomatoes-data")
const {
    MessageButton,
    MessageActionRow
} = require('discord.js');
const {
    set
} = require("quick.db");

// Regular prefix command handling
module.exports = {
    name: "rottentomato",
    description: "Return Rotten Tomato scores for a given movie title",
    usage: "?rottentomato",
    async execute(client, message, args) {

        if (!args[0]) return message.reply("You must give me a movie title to search!")

        let search = args.join(" ");
        const intros = ['Searching Rotten Tomatoes for', 'Scouring Rotten Tomatoes for', 'Browsing Rotten Tomato Reviews for', 'Paying critics for', 'Checking a picture book for', 'Feeling movie lucky? Looking for', 'Hey Alexa, look on Rotten Tomatoes for', 'Hey Siri, search on Rotten Tomatoes for', 'Asking a certified critic for']
        let choice = intros[Math.floor(Math.random() * intros.length)]
        message.channel.send(`${choice} \`${search}\` <a:rottentomato:883843755352924190>`).then(async (message) => {

            const data = await fetchRT(search);
            console.log(data);
            if (data.ok == true) {
                let title = data.movie.name;
                let score = data.movie.meterScore;
                let scoreClass = data.movie.meterClass == 'certified_fresh' ? "Certified Fresh" : "Rotten";
                let year = data.movie.year;
                let url = data.movie.url;
                let consensus = data.movie.consensus;
                let actors = data.movie.actors.join(", ");

                let fresh = 'https://www.pngitem.com/pimgs/m/138-1381056_rotten-tomatoes-fresh-logo-hd-png-download.png'
                let flop = 'https://www.pngitem.com/pimgs/m/232-2328025_file-rotten-tomatoes-wikimedia-clipart-png-download-rotten.png'
                let thumb = scoreClass == 'Certified Fresh' ? fresh : flop;
                let color = scoreClass == 'Certified Fresh' ? colours.red_light : colours.green_dark;

                let embed = new Discord.MessageEmbed()
                    .setTitle(`**${title}**`)
                    .setDescription(`${consensus}`)
                    .setColor(color)
                    .addField("Score", `${score}%`, true)
                    .addField("Class", scoreClass, true)
                    .addField("\u200B", '\u200B', true)
                    .addField("Year", year, true)
                    .addField("Featured Actors", actors, true)
                    .addField("\u200B", '\u200B', true)
                    .setThumbnail(thumb)
                    .setFooter('Rotten Tomatoes')
                    .setTimestamp()

                const sourceBtn = new MessageButton()
                    .setLabel('Source')
                    .setURL(url)
                    .setStyle('LINK')

                const row = new MessageActionRow().addComponents(
                    nextBtn, prevBtn, sourceBtn, closeBtn
                )

                message.edit(' ­') //invisible char to make embed edit cleaner
                message.edit({
                    components: [row],
                    embeds: [embed]
                });

            } else {
                return message.edit("I couldn't find any results for that movie title");
            }
        })

    }
}