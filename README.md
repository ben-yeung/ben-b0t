# ben-b0t
[![Discord.js](https://img.shields.io/badge/discord.js-v12-blue?style=for-the-badge&logo=discord)](https://www.npmjs.com/package/discord.js)
   [![npm](https://img.shields.io/badge/npm-v6.14.13-red?style=for-the-badge&logo=npm)](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
   [![Node.js](https://img.shields.io/badge/Node.js-v14.17.3-brightgreen?style=for-the-badge&logo=nodejs)](https://dev.twitch.tv/docs/)
   [![Twitch API](https://img.shields.io/badge/Twitch%20API-Doc-blueviolet?style=for-the-badge&logo=twitch)](https://dev.twitch.tv/docs/)


## Discord Bot written in JavaScript using discord.js
This project began Fall 2020 and was published to a public repo on 04/24/21


## 🤖 A simple, personalized Discord Bot to interact and moderate a Discord server. 

Overall a very interactive project that allowed me to learn more about Data Structures, string manipulation, OAuth Flows, and parsing I/O.
Originally an single file full of if statements, this repo publication is a cleaner and more organized version with a command handler.

## 👾 Over 30+ Commands ranging from moderation, information, and fun.
* 🚨 **Moderation**: `ban`, `kick`, `mute`, `modclear`, `clearb0t`, `shutdown`, and more
* 🎊 **Fun**: `dog`, `cat`, `ascii`, `8ball`, `fliptext`, `ytsearch`, and more
* 🔎 **Search**: `define`, `syn`, `translate`, `find [Google Image Search]`, and more
* 📊 **Information**: `covid`, `weather`, `poll`, `uptime`, `remind`, `decide`, `calc` and more
* 💬 Log chat message streaks and those who willingly or accidentally break them!
* 👽 Have fun trolling friends with image manipulation using Canvacord API.
* 📚 Quickly find images, definitions, translations, YouTube videos, and more with ease!
* ⚖️ Create polls, generate random numbers, flip a coin, ask an 8ball for guidance, find random cat gifs.

## 📺 Twitch API Integration
* Client Credentials OAuth Flow
* Return information about a given streamer username with the `twitch [username]` command.
* Options to setup a CronJob to automatically send Twitch clips of a given streamer to a Discord channel.
  * Do note that this command is used and tested on a smaller channel.
  * There is no spam prevention and thus any clips within the past day are sent automatically to a given channel.

## 🆕 Discord Button Integration
*  With the beta release of Discord buttons set to launch with d.js V13, embeds incorporating reactions for user input now looks a lot cleaner!
*  Using [discord-buttons](https://www.npmjs.com/package/discord-buttons), many commands that once relied on reactions now have a spiffy new look with better funcitonality.
*  Instead of waiting for the bot to add reactions (embed pagination for example), these buttons can be instantly accessed and edited across several message edits!

## 🆕 Slash Command Integration
* The usage of slash commands and its integration over prefix commands stems from the ease of access for both the developer and the user.
* This is especially noticeable for longer commands with multiple arguments where it is easy to mess up the order of inputs.
* On the developer side, slash commands neatly organize and store arguments in a given order so developers do not have to parse raw input and decipher which inputs belong to a given argument.
* As custom slash commands are still in beta, [WOKCommands](https://docs.wornoffkeys.com/commands/slash-commands) provides an awesome slash command handler to do the heavy lifting.
* Do note that in order to get discord-buttons integration working smoothly I had to edit WOKCommands Slash Command handler source with this PR:
  * https://github.com/AlexzanderFlores/WOKCommands/pull/108/files
  * This essentially made the WOKCommands handler only parse interactions of type 2 to prevent crashing when using other types of interactions (i.e. `interaction.type == 2`)
  * A very helpful package I found online was [patch-package](https://www.npmjs.com/package/patch-package) which allows you to edit these npm packages and when pushing to a host such as Heroku patch-package can modify these personal fixes when installing node_modules.

## 🧰 Debugging / Notes
* Note that some commands may use the `quick.db` package.
  * Trying to deploy with services such as Heroku may not support long term storage.
  * Heroku reruns daily so quick.db essentially restarts everyday.
  * Check with the provider FAQs to see if there is an alternative approach.
  * One approach could be quickmongo but be sure to check for potential updated solutions.
* The help command excludes some moderation / bot config commands from general public access; adjust as necessary.
* Some moderation commands may become deprecated as Discord.js changes.
* Some commands are tailored specifically with botconfig.json or specific server settings. This repo mainly serves as a way for other developers to find inspiration for new commands and improve the ones that are currently here.
* Helpful documentation that I referenced:
  * [Discord Dev Docs on Slash Commands](https://discord.com/developers/docs/interactions/slash-commands)
  * [discord-buttons examples](https://github.com/discord-buttons/discord-buttons/blob/main/examples.md)
  * [WOKCommands Command Properties](https://docs.wornoffkeys.com/commands/commands)
  * [WOKCommands Slash Commands Docs](https://docs.wornoffkeys.com/commands/slash-commands)
  * [discord.js-slash-commands.md by advaith1](https://gist.github.com/advaith1/287e69c3347ef5165c0dbde00aa305d2)
* [patch-package](https://www.npmjs.com/package/patch-package) edits:
  * stockx-api/index.js require path fix to point to './src/classes/stockx.js'
  * wokcommands/dist/SlashCommands.js (see PR linked above)

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


