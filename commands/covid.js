const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const api = require('novelcovid');
api.settings({
    baseUrl: 'https://disease.sh' | 'https://api.caw.sh' | 'https://corona.lmao.ninja'
})

module.exports = {
    name: "covid",
    description: "Get yesterday's data on COVID",
    usage: "?covid [global/country/state]",
    async execute(bot, message, args) {

        // CURRENTLY DEPRECATED

        if (!args[0]) return message.channel.send("No arguments given. Please enter a country.");

        let possible = ["world", "global", "all", "total"];

        if (possible.some(word => args[0].toLowerCase().includes(word))) {
            let corona = await api.yesterday.all();
            const embed = new Discord.MessageEmbed()
                .setTitle('Global Info')
                .addField("Total Confirmed Cases:", corona.cases, true)
                .addField("Total Deaths: ", corona.deaths, true)
                .addField("Total Recovered: ", corona.recovered, true)
                .addField("Yesterday\'s Confirmed Cases: ", corona.todayCases, true)
                .addField("Yesterday\'s Deaths: ", corona.todayDeaths, true)

            message.channel.send({
                embeds: [embed]
            });;
        } else {
            let corona = await api.yesterday.countries({
                country: args.join(" ")
            })
            let corona2 = await api.yesterday.states({
                state: args.join(" ")
            })

            if (!corona.country) {

                if (!corona2.state) return message.channel.send("Check for any typos. I can't recognize that state/country.")

                const embed = new Discord.MessageEmbed()
                    .setColor(colours.red_light)
                    .setTitle(`${corona2.state}`)
                    .setDescription(`Info on COVID-19 in ${corona2.state}`)
                    .addField("Total Confirmed Cases:", corona2.cases, true)
                    .addField("Total Deaths: ", corona2.deaths, true)
                    .addField("Yesterday\'s Confirmed Cases: ", corona2.todayCases)
                    .addField("Yesterday\'s Deaths: ", corona2.todayDeaths, true)

                message.channel.send({
                    embeds: [embed]
                });;
            } else {
                const embed = new Discord.MessageEmbed()
                    .setColor(colours.red_light)
                    .setTitle(`${corona.country}`)
                    .setDescription(`Info on COVID-19 in ${corona.country}`)
                    .addField("Total Confirmed Cases:", corona.cases, true)
                    .addField("Total Deaths: ", corona.deaths, true)
                    .addField("Total Recovered: ", corona.recovered, true)
                    .addField("Yesterday\'s Confirmed Cases: ", corona.todayCases, true)
                    .addField("Yesterday\'s Deaths: ", corona.todayDeaths, true)

                message.channel.send({
                    embeds: [embed]
                });;
            }


        }

    }
}