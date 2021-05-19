const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const request = require("request");

module.exports = {
    name: "twitch",
    description: "Returns information on a given streamer",
    usage: "?twitch [username]",
    execute(bot, message, args) {

        if (!args[0]) return message.reply("You must specify a username to lookup on Twitch!");
        const streamer = args[0];

        const getToken = (url, callback) => {
            const options = {
                url: url, //See https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#oauth-client-credentials-flow
                json: true,
                body: {
                    client_id: botconfig.CLIENT_ID,
                    client_secret: botconfig.CLIENT_SECRET,
                    grant_type: 'client_credentials'
                }
            };

            request.post(options, (err, res, body) => {
                if (err) {
                    return console.log(err);
                }
                console.log(`Status: ${res.statusCode}`);
                console.log(body);

                callback(res);
            })
        };
        var AT = ''; //OAuth App Acces Token (For clip GET request)
        getToken(botconfig.GET_TOKEN, (res) => {
            AT = res.body.access_token;
            return AT;
        })

        const getUser = (url, accessToken, callback) => {

            const idOptions = {
                url: url, // https://api.twitch.tv/helix/users?login=<username>
                method: "GET",
                headers: {
                    'Client-ID': botconfig.CLIENT_ID,
                    'Authorization': 'Bearer ' + accessToken
                }
            };
            request.get(idOptions, (err, res, body) => {
                if (err) {
                    return console.log(err);
                }
                console.log(`Status: ${res.statusCode}`);
                console.log(JSON.parse(body));

                callback(res);
            });
        };

        setTimeout(() => {
            var broadcaster = undefined;
            getUser(`https://api.twitch.tv/helix/users?login=${streamer}`, AT, (res) => {
                broadcaster = JSON.parse(res.body).data[0]; //get user id from request
                if (broadcaster == undefined) return message.reply("An error occurred. Please check if this is a valid username.")
                console.log(broadcaster)

                let embed = new Discord.MessageEmbed()
                    .setTitle(broadcaster.display_name)
                    .setURL(`https://twitch.tv/${broadcaster.display_name}`)
                    .setAuthor('Twitch Lookup')
                    .setDescription(`${broadcaster.description}\n\n**Total Views:** ${broadcaster.view_count.toLocaleString()}\n**Account Created:** ${new Date(broadcaster.created_at).toLocaleDateString()} \n`)
                    .setThumbnail(broadcaster.profile_image_url)
                    .setFooter(broadcaster.id)
                    .setColor(colours.purple_medium)
                    .setTimestamp()

                message.channel.send(embed);

            })

        }, 1000);

    }
}