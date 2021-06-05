# ben-b0t
[![Discord.js](https://img.shields.io/badge/discord.js-v12-blue?style=for-the-badge&logo=discord)](https://www.npmjs.com/package/discord.js)
   [![npm](https://img.shields.io/badge/npm-v7.15.1-red?style=for-the-badge&logo=npm)](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
   [![Node.js](https://img.shields.io/badge/Node.js-v16.3.0-brightgreen?style=for-the-badge&logo=nodejs)](https://dev.twitch.tv/docs/)
   [![Twitch API](https://img.shields.io/badge/Twitch%20API-Doc-blueviolet?style=for-the-badge&logo=twitch)](https://dev.twitch.tv/docs/)


## Discord Bot written in JavaScript using discord.js
This project began Fall 2020 and was published to a public repo on 04/24/21


## 🤖 A simple, personalized Discord Bot to interact, moderate, and log a Discord server. 

Overall a very interactive project that allowed me to learn more about Data Structures, string manipulation, OAuth Flows, and parsing I/O.
Originally an single file full of if statements, this repo publication is a cleaner and more organized version with a command handler.

## 👾 Over 30+ Commands ranging from moderation, fun, and information.
* 🚨 **Moderation**: `ban`, `kick`, `mute`, `modclear`, `clearb0t`, `shutdown`, and more
* 🎊 **Fun**: `dog`, `cat`, `ascii`, `8ball`, `fliptext`, `ytsearch`, and more
* 🔎 **Search**: `define`, `syn`, `translate`, `find [Google Image Search]`, and more
* 📊 **Information**: `covid`, `weather`, `poll`, `uptime`, `remind`, `decide`, and more


## 📺 Twitch API Integration
* Client Credentials OAuth Flow
* Return information about a given streamer username with the `twitch [username]` command.
* Options to setup a CronJob to automatically send Twitch clips of a given streamer to a Discord channel.
  * Do note that this command is used and tested on a smaller channel.
  * There is no spam prevention and thus any clips within the past day are sent automatically to a given channel.

## 🧰 Debugging / Notes
* Note that some commands may use the `quick.db` package 
 * Trying to deploy with services such as Heroku may not support long term storage that quick.db may need
 * Check with the provider FAQs to see if there is an alternative approach
* The help command excludes some moderation / bot config commands from general public access; adjust as necessary
* Some moderation commands may become deprecated as Discord.js changes

## 🛠 Dependencies Include:
* [canvacord](https://canvacord.js.org/#/)
* [node-fetch](https://www.npmjs.com/package/node-fetch)
* [weather-js](https://www.npmjs.com/package/weather-js)
* [novelcovid](https://www.npmjs.com/package/novelcovid)
* [images-scraper](https://www.npmjs.com/package/images-scraper)
* [thesaurus](https://www.npmjs.com/package/thesaurus)
* [cron](https://www.npmjs.com/package/cron)
* [quick.db](https://www.npmjs.com/package/quick.db)
* [request](https://www.npmjs.com/package/request)
* [mathjs](https://www.npmjs.com/package/mathjs)
* [ytsr](https://www.npmjs.com/package/ytsr)
* [ms](https://www.npmjs.com/package/ms)


