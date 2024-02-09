# ben-b0t

[![Discord.js](https://img.shields.io/badge/discord.js-v13-blue?style=for-the-badge&logo=discord)](https://www.npmjs.com/package/discord.js)
   [![npm](https://img.shields.io/badge/npm-v8.5.2-red?style=for-the-badge&logo=npm)](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
   [![Node.js](https://img.shields.io/badge/Node.js-v16.14.2-brightgreen?style=for-the-badge&logo=node.js)](https://nodejs.org/en/)
   [![Twitch API](https://img.shields.io/badge/Twitch%20API-Doc-blueviolet?style=for-the-badge&logo=twitch)](https://dev.twitch.tv/docs/)

## Discord Bot written in JavaScript using discord.js v14

This project began Fall 2020 and was published to a public repo on 04/24/21

2022 Rewrite to focus on Slash Commands and Discord.js v13

2024 Rewrite to focus on complying with Discord.js v14

## 🤖 A simple, personalized Discord Bot to interact and moderate a Discord server.

Overall a very interactive project that allowed me to learn more about Data Structures, String manipulation, OAuth Flows, and REST APIs.

## 👾 Over 20+ Commands ranging from moderation, information, and fun.

- 🚨 **Moderation**: `ban`, `kick`, `mute`, `modclear`, `shutdown`, and more
- 🔎 **Information**: `define`, `syn`, `find [Google Image Search]`, `weather`, `summarize (GPT-4 Enabled)`and more
- 🎊 **Fun**: `8ball`, `decide`, `play`, and more
- 💬 Log chat message streaks and those who willingly or accidentally break them!
- 📚 Quickly find images, definitions, YouTube videos, and more with ease!
- 🎵 Queue and play videos from YouTube to create music sessions with friends.

# ✨ GPT-4 Integration

- `/summarize` utilizes OpenAI's GPT-4 API to review and summarize messages in a given Discord channel.
- The command also supports follow up questions via replying to the interaction message.
- The bot will then track the current conversation to help clarify summaries and answer follow-up questions.
- Message logging is done via quick.db meaning it is all stored locally and is never uploaded anywhere.
  - For more a more persistent solution consider utilizing a MongoDB cluster

## 📺 Twitch API Integration

- Deprecated/Not in use by current version
- Client Credentials OAuth Flow
- Return information about a given streamer username with the `twitch [username]` command.
- Options to setup a CronJob to automatically send Twitch clips of a given streamer to a Discord channel.
  - Do note that this command is used and tested on a smaller channel.
  - There is no spam prevention and thus any clips within the past day are sent automatically to a given channel.

## 📅 Google Calendar API Integration

- Requires Google API and Calendar IDs (See src/botconfig.json)
- Scheduled Cron jobs to check events from a Google Calendar.
- Posts an embed containing event title, description, and any links.
- Supports all-day events as well as scheduled events.
- Cron job can be configured to check more frequently.

## 🧰 Debugging / Notes

- If you are uploading this to a public repo be sure to exclude botconfig.json in the .gitignore
- Note that some commands may use the `quick.db` package.
  - Trying to deploy with services such as Heroku may not support persistent long term storage.
  - Heroku reruns daily so quick.db essentially restarts everyday.
  - Check with the provider FAQs to see if there is an alternative approach.
- The help command excludes some moderation / bot config commands from general public access; adjust as necessary.
- Some commands may become deprecated/removed as Discord.js changes.
- Some commands are tailored specifically with botconfig.json or specific server settings. This repo mainly serves as a way for other developers to find inspiration for new commands and improve the ones that are currently here.
- Helpful documentation that I referenced:
  - [Discord Dev Docs on Slash Commands](https://discord.com/developers/docs/interactions/slash-commands)
- [patch-package](https://www.npmjs.com/package/patch-package) edits:
  - stockx-api/index.js require path fix to point to './src/classes/stockx.js'
  - Temp fix to youtube player dependency to prevent audio from cutting out.

## 🛠 Dependencies Include:

- [openai](https://www.npmjs.com/package/openai)
- [distube](https://www.npmjs.com/package/distube)
- [canvacord](https://canvacord.js.org/#/)
- [node-fetch](https://www.npmjs.com/package/node-fetch)
- [weather-js](https://www.npmjs.com/package/weather-js)
- [novelcovid](https://www.npmjs.com/package/novelcovid)
- [images-scraper](https://www.npmjs.com/package/images-scraper)
- [thesaurus](https://www.npmjs.com/package/thesaurus)
- [cron](https://www.npmjs.com/package/cron)
- [quick.db](https://www.npmjs.com/package/quick.db)
- [request](https://www.npmjs.com/package/request)
- [mathjs](https://www.npmjs.com/package/mathjs)
- [ytsr](https://www.npmjs.com/package/ytsr)
- [ms](https://www.npmjs.com/package/ms)
