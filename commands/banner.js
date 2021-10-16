const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const fetch = require("node-fetch")

module.exports = {
    name: "banner",
    description: "Sends banner of @'d user",
    usage: "?banner [@user]",
    async execute(client, message, args) {

        const user = message.mentions.users.first() || message.author;
        const userID = user.id;

        let response = fetch(`https://discord.com/api/v8/users/${userID}`, {
            method: 'GET',
            headers: {
                Authorization: `Bot ${client.token}`
            }
        })

        let receive = ''
        let banner = 'https://cdn.discordapp.com/attachments/829722741288337428/834016013678673950/banner_invisible.gif' // invisible image fallback

        response.then(a => {
            if (a.status !== 404) {
                a.json().then(data => {
                    receive = data['banner']

                    if (receive !== null) {

                        let format = 'png'
                        if (receive.substring(0, 2) === 'a_') {
                            format = 'gif'
                        }

                        banner = `https://cdn.discordapp.com/banners/${userID}/${receive}.${format}`
                        let embed = new Discord.MessageEmbed()
                            .setTitle(`${user.username}'s Banner`)
                            .setImage(banner)
                            .setColor(colours.blue_light)
                            .setTimestamp()

                        message.channel.send({
                            embeds: [embed]
                        });

                    }
                })
            }
        })
    }
}