const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const request = require("request");

// This command uses Twitch API Client IDs and Client Secrets
// For documentation on how to get started visit https://dev.twitch.tv/docs/api
// The command is automated via CronJob in index.js
module.exports = {
    name: "twitchclips",
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
                console.log(`Status: ${res.statusCode}`);
                console.log(JSON.parse(body));

                callback(res);
            });
        };
        var broadcaster_id = ''; //Streamer user id
        setTimeout(() => {
            getUserID(botconfig.GET_ID, AT, (res) => {
                broadcaster_id = JSON.parse(res.body).data[0].id; //get user id from request
                return broadcaster_id;
            })

            const getClips = (url, accessToken, callback) => {

                const clipOptions = {
                    url: url + broadcaster_id + '&first=100', // See https://dev.twitch.tv/docs/api/reference#get-clips examples
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
                    console.log(`Status: ${res.statusCode}`);
                    //console.log(JSON.parse(body).data);

                    callback(res);
                });
            };

            //calling GET request for clips
            setTimeout(() => {
                getClips(botconfig.GET_CLIPS, AT, (res) => {
                    const clipsArr = JSON.parse(res.body).data;
                    console.log(clipsArr)
                })
            }, 1000)
        }, 1000)


    }
}