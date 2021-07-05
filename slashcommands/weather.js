const Discord = require("discord.js")
const colours = require("../colours.json");
const botconfig = require("../botconfig.json");
const weather = require("weather-js");
const disbut = require('discord-buttons');

function tConvert(time) {
    // Check correct time format and split into components
    time = time.match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
        time = time.slice(1); // Remove full string match value
        time[0] = +time[0] % 12 || 12; // Adjust hours
        time.splice(time.length - 1) // Delete seconds
    }
    return time.join(''); // return adjusted time or original string
}

function dConvert(date) {
    date = date.match(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/) || [date];

    if (date.length > 1) {
        date = date.slice(1);
        if (date[0][0] == '0') {
            date[0] = date[0][1];
        }
        let res = date[0] + '/' + date[1];
        return res;
    }
    return date.join('');

}

function getPrecip(forecast) {
    if (forecast.precip == "") return "N/A";
    else return forecast.precip + "%";
}

module.exports = {
    slash: true,
    description: "Find info on the weather in a given location!",
    testOnly: false, //guild testing when true, set to false for global
    minArgs: 1,
    expectedArgs: '<location>', //note: have these all lowercased!
    callback: async ({ // put async after 'callback:' for async functions
        client,
        channel,
        interaction,
        args
    }) => {
        const [city] = args

        let degreeType = "F";

        await weather.find({
            search: city,
            degreeType: degreeType
        }, async function (err, result) {

            if (err || result === undefined || result.length === 0) return `Error finding the given city: **${city}**. Please check for typos. If this is a real city then tell Ben his code broke.`

            let current = result[0].current;
            let location = result[0].location;
            let forecast = result[0].forecast;
            var skycodes = []
            //console.log(forecast)

            for (var i = 0; i < forecast.length; i++) {
                switch (forecast[i].skycodeday) {
                    case "0":
                    case "1":
                    case "2":
                    case "3":
                    case "4":
                    case "17":
                    case "35":
                    case "37":
                    case "38":
                    case "47":
                        skycodes.push(":thunder_cloud_rain:");
                        break;
                    case "5":
                    case "6":
                    case "7":
                    case "13":
                    case "14":
                    case "16":
                    case "42":
                    case "43":
                    case "15":
                    case "41":
                    case "46":
                        skycodes.push(":cloud_snow:");
                        break;
                    case "8":
                    case "25":
                        skycodes.push(":snowflake:");
                        break;
                    case "9":
                    case "10":
                    case "11":
                    case "12":
                    case "18":
                    case "40":
                    case "39":
                    case "45":
                        skycodes.push(":cloud_rain:");
                        break;
                    case "19":
                        skycodes.push(":dash:");
                        break;
                    case "20":
                    case "21":
                    case "22":
                        skycodes.push(":fog:");
                        break;
                    case "23":
                    case "24":
                        skycodes.push(":wind_blowing_face:");
                        break;
                    case "26":
                    case "27":
                    case "29":
                    case "33":
                        skycodes.push(":cloud:");
                        break;
                    case "28":
                        skycodes.push(":white_sun_cloud:")
                        break;
                    case "30":
                    case "34":
                        skycodes.push(":partly_sunny:");
                        break;
                    case "31":
                    case "32":
                        skycodes.push(":sunny:");
                        break;
                    case "36":
                        skycodes.push(":fire:");
                        break;

                    default:
                        skycodes.push(":alien:");
                        break;
                }
            }

            const author = interaction.member.user;

            const embed = new Discord.MessageEmbed()
                .setTitle(`Weather in ${current.observationpoint}`)
                .setColor(colours.gold)
                .setDescription(`**${current.day} (${dConvert(current.date)})** \n> ${current.skytext}\n`)
                .setThumbnail(current.imageUrl)
                .addField("Temperature", `${current.temperature}°F`, true)
                .addField("It Feels Like", `${current.feelslike}°F`, true)
                .addField("\u200B", '\u200B', true)
                .addField("Winds", current.winddisplay, true)
                .addField("Humidity", `${current.humidity}%`, true)
                .addField("\u200B", '\u200B', true)
                .addField("Observed", `${tConvert(current.observationtime)}`, true)
                .addField("Timezone", `GMT ${location.timezone}`, true)
                .addField("\u200B", '\u200B', true)

            let nextBtn = new disbut.MessageButton()
                .setLabel('Show Forecast')
                .setID('weather_next')
                .setStyle('blurple')

            let backBtn = new disbut.MessageButton()
                .setLabel('Back')
                .setID('weather_back')
                .setStyle('blurple')

            client.reply(interaction, `Searching for the weather in ${city} :mag:`)
            const message = await client.api.webhooks(client.user.id, interaction.token).messages('@original').patch({
                data: {}
            })

            let messageObj = new Discord.Message(client, message, client.channels.cache.get(message.channel_id))
            messageObj.edit(' ­') //invisible char to make embed edit cleaner
            messageObj.channel.send({
                buttons: [nextBtn],
                embed: embed
            }).then(async (message) => {
                client.on('clickButton', async (b) => {
                    b.reply.defer()
                    await b.clicker.fetch();

                    if (b.clicker.user.id == author.id) {
                        if (b.id === 'weather_next') {
                            let foreEmb = new Discord.MessageEmbed()
                                .setTitle(`Forecast for ${current.observationpoint}`)
                                .setColor(colours.gold)
                                .addField(`${forecast[0].day}  (${dConvert(forecast[0].date)})`, `> ${forecast[0].skytextday} \u200B ${skycodes[0]} \n High: **${forecast[0].high}°F**  |  Low: **${forecast[0].low}°F**  |  Precip: **${getPrecip(forecast[0])}**\n`)
                                .addField(`${forecast[1].day}  (${dConvert(forecast[1].date)})`, `> ${forecast[1].skytextday} \u200B ${skycodes[1]} \n High: **${forecast[1].high}°F**  |  Low: **${forecast[1].low}°F**  |  Precip: **${getPrecip(forecast[1])}**\n`)
                                .addField(`${forecast[2].day}  (${dConvert(forecast[2].date)})`, `> ${forecast[2].skytextday} \u200B ${skycodes[2]} \n High: **${forecast[2].high}°F**  |  Low: **${forecast[2].low}°F**  |  Precip: **${getPrecip(forecast[2])}**\n`)
                                .addField(`${forecast[3].day}  (${dConvert(forecast[3].date)})`, `> ${forecast[3].skytextday} \u200B ${skycodes[3]} \n High: **${forecast[3].high}°F**  |  Low: **${forecast[3].low}°F**  |  Precip: **${getPrecip(forecast[3])}**\n`)
                                .addField(`${forecast[4].day}  (${dConvert(forecast[4].date)})`, `> ${forecast[4].skytextday} \u200B ${skycodes[4]} \n High: **${forecast[4].high}°F**  |  Low: **${forecast[4].low}°F**  |  Precip: **${getPrecip(forecast[4])}**\n`)

                            message.edit({
                                buttons: [backBtn],
                                embed: foreEmb
                            })

                        } else if (b.id === 'weather_back') {
                            let mainEmb = new Discord.MessageEmbed()
                                .setTitle(`Weather in ${current.observationpoint}`)
                                .setColor(colours.gold)
                                .setDescription(`**${current.day} (${dConvert(current.date)})** \n> ${current.skytext}\n`)
                                .setThumbnail(current.imageUrl)
                                .addField("Temperature", `${current.temperature}°F`, true)
                                .addField("It Feels Like", `${current.feelslike}°F`, true)
                                .addField("\u200B", '\u200B', true)
                                .addField("Winds", current.winddisplay, true)
                                .addField("Humidity", `${current.humidity}%`, true)
                                .addField("\u200B", '\u200B', true)
                                .addField("Observed", `${tConvert(current.observationtime)}`, true)
                                .addField("Timezone", `GMT ${location.timezone}`, true)
                                .addField("\u200B", '\u200B', true)

                            message.edit({
                                buttons: [nextBtn],
                                embed: mainEmb
                            })
                        }
                    }

                })
            })



            //     messageObj.react('➡️')

            //     const collector = messageObj.createReactionCollector(
            //         // only collect left and right arrow reactions from the message author
            //         (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === author.id,
            //         // time out after a minute
            //         {
            //             time: 90000
            //         }
            //     )

            //     collector.on('collect', reaction => {
            //         // remove the existing reactions
            //         messageObj.reactions.removeAll().then(async () => {
            //             let embed = new Discord.MessageEmbed()
            //             // increase/decrease index
            //             if (reaction.emoji.name === '⬅️') {
            //                 currInd -= 1
            //                 embed.setTitle(`Weather in ${current.observationpoint}`)
            //                     .setColor(colours.gold)
            //                     .setDescription(`**${current.day} (${dConvert(current.date)})** \n> ${current.skytext}\n`)
            //                     .setThumbnail(current.imageUrl)
            //                     .addField("Temperature", `${current.temperature}°F`, true)
            //                     .addField("It Feels Like", `${current.feelslike}°F`, true)
            //                     .addField("\u200B", '\u200B', true)
            //                     .addField("Winds", current.winddisplay, true)
            //                     .addField("Humidity", `${current.humidity}%`, true)
            //                     .addField("\u200B", '\u200B', true)
            //                     .addField("Observed", `${tConvert(current.observationtime)}`, true)
            //                     .addField("Timezone", `GMT ${location.timezone}`, true)
            //                     .addField("\u200B", '\u200B', true)
            //                     .setFooter(`Use reacts to see upcoming forecast`)
            //             } else {
            //                 currInd += 1
            //                 embed.setTitle(`Forecast for ${current.observationpoint}`)
            //                     .setColor(colours.gold)
            //                     .addField(`${forecast[0].day}  (${dConvert(forecast[0].date)})`, `> ${forecast[0].skytextday} \u200B ${skycodes[0]} \n High: **${forecast[0].high}°F**  |  Low: **${forecast[0].low}°F**  |  Precip: **${getPrecip(forecast[0])}**\n`)
            //                     .addField(`${forecast[1].day}  (${dConvert(forecast[1].date)})`, `> ${forecast[1].skytextday} \u200B ${skycodes[1]} \n High: **${forecast[1].high}°F**  |  Low: **${forecast[1].low}°F**  |  Precip: **${getPrecip(forecast[1])}**\n`)
            //                     .addField(`${forecast[2].day}  (${dConvert(forecast[2].date)})`, `> ${forecast[2].skytextday} \u200B ${skycodes[2]} \n High: **${forecast[2].high}°F**  |  Low: **${forecast[2].low}°F**  |  Precip: **${getPrecip(forecast[2])}**\n`)
            //                     .addField(`${forecast[3].day}  (${dConvert(forecast[3].date)})`, `> ${forecast[3].skytextday} \u200B ${skycodes[3]} \n High: **${forecast[3].high}°F**  |  Low: **${forecast[3].low}°F**  |  Precip: **${getPrecip(forecast[3])}**\n`)
            //                     .addField(`${forecast[4].day}  (${dConvert(forecast[4].date)})`, `> ${forecast[4].skytextday} \u200B ${skycodes[4]} \n High: **${forecast[4].high}°F**  |  Low: **${forecast[4].low}°F**  |  Precip: **${getPrecip(forecast[4])}**\n`)
            //             }
            //             // edit message with new embed
            //             messageObj.edit(embed)
            //             // react with left arrow if it isn't the start (await is used so that the right arrow always goes after the left)
            //             if (currInd !== 0) await messageObj.react('⬅️')
            //             // react with right arrow if it isn't the end
            //             if (currInd !== 1) messageObj.react('➡️')
            //         })
            //     })
        })
    },
}