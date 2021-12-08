const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const fetch = require("node-fetch")

// Regular prefix command handling
module.exports = {
    name: "halo",
    description: "Pulls Halo Infinite Data for given player",
    usage: "?halo [username]",
    execute(client, message, args) {

        if (!args.length) {
            return message.reply("You must give me a gamertag to lookup!")
        }

        gamer = args.join("%20")

        // Info on getting a Cryptum-Token can be found here https://developers.halodotapi.com/docs/cryptum/YXBpOjE5NTM0NTQ4-cryptum-api
        let response = fetch(`https://cryptum.halodotapi.com/games/hi/stats/players/${gamer}/service-record/global`, {
            method: 'GET',
            headers: {
                Authorization: `Cryptum-Token ${botconfig.HALO_INFINITE_ACCESS}`
            }
        })

        response.then(a => {
            // console.log(a)
            if (a.status == 200) {

                let gamerThumbResponse = fetch(`https://cryptum.halodotapi.com/games/hi/appearance/players/${gamer}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Cryptum-Token ${botconfig.HALO_INFINITE_ACCESS}`
                    }
                })

                a.json().then(async resp => {
                    console.log(resp)

                    var gamerThumb = 'https://pbs.twimg.com/media/E3lBOh5XIAIpz1p.jpg'

                    await gamerThumbResponse.then(b => {
                        // console.log(b)
                        if (b.status == 200) {
                            b.json().then(bResp => {
                                // console.log(bResp)
                                gamerThumb = bResp.data.emblem_url

                                let embed = new Discord.MessageEmbed()
                                    .setTitle(`${resp.additional.gamertag}'s Halo Infinite Stats`)
                                    .setDescription(`**Time Played:** ${resp.data.time_played.human} 
                                            \n **Matches:** ${resp.data.matches_played}
                                            \n ** Win Rate:** ${resp.data.win_rate.toFixed(2)}%
                                            \n **KD:** ${resp.data.kdr.toFixed(3)} 
                                            \n **Kills:** ${resp.data.summary.kills} 
                                            \n **Deaths:** ${resp.data.summary.deaths} 
                                            \n **Assists:** ${resp.data.summary.assists} 
                                            \n **Accuracy:** ${resp.data.shots.accuracy.toFixed(2)}% `)

                                    .setThumbnail(gamerThumb)
                                    .setColor(colours.green_light)

                                message.channel.send({
                                    embeds: [embed]
                                })
                            })
                        }


                    })


                })
            } else {
                return message.reply("I couldn't find a Halo Infinite gamer with that username.")
            }

        })

    }
}