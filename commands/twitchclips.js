const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const request = require("request");
const db = require("quick.db");

// This command uses Twitch API Client IDs and Client Secrets
// For documentation on how to get started visit https://dev.twitch.tv/docs/api
// The command is automated via CronJob in index.js
module.exports = {
    name: "twitchclipsauto",
    description: "Grabs twitch clips of given channel",
    usage: "Automated by CronJob",
    execute(bot, message, args) {

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
                console.log(`Token POST Status: ${res.statusCode}`);
                //console.log(body);

                callback(res);
            })
        };
        var AT = ''; //OAuth App Acces Token (For clip GET request)
        getToken(botconfig.GET_TOKEN, (res) => {
            AT = res.body.access_token;
            return AT;
        })

        const getUserID = (url, accessToken, callback) => {

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
                console.log(`User GET Status: ${res.statusCode}`);
                //console.log(JSON.parse(body));

                callback(res);
            });
        };
        var broadcaster_id = ''; //Streamer user id
        setTimeout(() => {
            getUserID(botconfig.GET_ID, AT, (res) => {
                broadcaster_id = JSON.parse(res.body).data[0].id; //get user id from request
                return broadcaster_id;
            })
            var todayDate = new Date().toISOString();
            const getClips = (url, accessToken, callback) => {

                const clipOptions = {
                    url: url + broadcaster_id + `&first=100&started_at=${todayDate}`, // See https://dev.twitch.tv/docs/api/reference#get-clips examples
                    method: "GET",
                    headers: {
                        'Client-ID': botconfig.CLIENT_ID,
                        'Authorization': 'Bearer ' + accessToken
                    }
                };
                request.get(clipOptions, (err, res, body) => {
                    if (err) {
                        return console.log(err);
                    }
                    console.log(`Clip GET Status: ${res.statusCode}`);
                    console.log(JSON.parse(body));

                    callback(res);
                });
            };

            //calling GET request for clips
            setTimeout(() => {
                getClips(botconfig.GET_CLIPS, AT, (res) => {
                    const clipsArr = JSON.parse(res.body).data;
                    var prevClips = db.get('clips');
                    if (!prevClips) {
                        db.set('clips', []);
                        prevClips = [];
                    }

                    let channelID = '844469067901304883';

                    for (var i = 0; i < clipsArr.length; i++) {
                        let clip = clipsArr[i];
                        var date = new Date(clip.created_at)
                        //console.log(`${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`)
                        if (!prevClips.includes(clip.id)) {
                            db.push('clips', clip.id);

                            // let embed = new Discord.MessageEmbed()
                            //     .setTitle(clip.title)
                            //     .setURL(clip.url)
                            //     .setDescription(`**Clipped by:** ${clip.creator_name}\n**Created:** ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}\n**Views:** ${clip.view_count}`)
                            //     .setImage(clip.thumbnail_url)
                            //     .setFooter(clip.id)
                            //     .setColor(colours.purple_medium);
                            try {
                                bot.channels.cache.get(channelID).send(clip.url);
                            } catch (e) {
                                return message.channel.send(e)
                            }
                        }
                    }
                    //console.log(db.get('clips'));
                });
            }, 1000)
        }, 1000);


    }
}