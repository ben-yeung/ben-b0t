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
                let score = `${data.movie.meterScore}`;
                var scoreClass = ""

                switch (data.movie.meterClass) {
                    case "fresh":
                        scoreClass = "Fresh";
                        break;
                    case "certified_fresh":
                        scoreClass = "Certified Fresh"
                        break;
                    case "rotten":
                        scoreClass = "Rotten"
                        break;
                    default:
                        scoreClass = "N/A"
                        break;
                }

                let year = `${data.movie.year}`;
                let url = data.movie.url;
                let consensus = data.movie.consensus;
                let actors = data.movie.actors.join(", ");

                let certfresh = 'https://www.rottentomatoes.com/static/images/icons/cf-lg.png'
                let fresh = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Rotten_Tomatoes.svg/757px-Rotten_Tomatoes.svg.png'
                let flop = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Rotten_Tomatoes_rotten.svg/1061px-Rotten_Tomatoes_rotten.svg.png'
                let unknown = 'https://danielarussocoaching.nl/wp-content/uploads/2019/02/question-mark-1019820_1280.jpg'
                var thumb;
                var color;

                switch (scoreClass) {
                    case "Fresh":
                        thumb = fresh;
                        color = colours.red_light;
                        break;
                    case "Certified Fresh":
                        thumb = certfresh;
                        color = colours.red_light;
                        break;
                    case "Rotten":
                        thumb = flop;
                        color = colours.green_dark;
                        break;
                    default:
                        thumb = unknown;
                        color = colours.white;
                        break;
                }

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
                    sourceBtn
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