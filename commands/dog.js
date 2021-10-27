const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const fetch = require("node-fetch")

module.exports = {
    name: "dog",
    description: "Returns a random dog picture",
    usage: "?dog",
    async execute(bot, message, args) {

        try {
            const res = await fetch('https://dog.ceo/api/breeds/image/random');
            const imgUrl = (await res.json()).message;
            const embed = new Discord.MessageEmbed()
                .setTitle("Random Dog Pic Generator")
                .setColor(colours.blue_light)
                .setImage(imgUrl)

            message.channel.send({
                embeds: [embed]
            });;
        } catch (e) {
            console.log(e);
        }

    }
}