const Discord = require('discord.js');
const {
    Client,
    Intents
} = require('discord.js');
const {
    MessageAttachment
} = require('discord.js');
const botconfig = require('./botconfig.json');
const cron = require("cron");
const allIntents = new Discord.Intents(32767);
const client = new Client({
    intents: [allIntents]
});
const WOKCommands = require('wokcommands') // Used to implement slash command handler
require("./util/eventHandler")(client);
const distube = require('distube');
const fs = require('fs');
const {
    google
} = require("googleapis");
const {
    testing
} = require('googleapis/build/src/apis/testing');
const {
    oauth2
} = require('googleapis/build/src/apis/oauth2');
const db = require("quick.db")
const ms = require("ms")

const {
    OAuth2
} = google.auth;

const oAuth2Client = new OAuth2(botconfig.G_CALENDAR_CLIENT_ID, botconfig.G_CALENDAR_CLIENT_SECRET)
oAuth2Client.setCredentials({
    refresh_token: botconfig.G_REFRESH_TOKEN
})

const calendar = google.calendar({
    version: 'v3',
    auth: oAuth2Client
})


let guildID = botconfig.GUILD_ID
// Various objects initialized in index.js and used in commands
client.commands = new Discord.Collection(); // Command Handler
client.reminders = new Map(); // commands/remind.js command
client.mute = new Map(); // commands/mute.js and commands/unmute.js commands
client.logs = new Map(); // commands/log.js command
client.counter = new Map(); // Keeping track of message streaks in client.on('message'...)
client.help = new Map(); // commands/help.js command
client.responses = new Map() // commands/menu.js command

// Basic prefix command handler taking filenamems from ./commands/ and putting them into a Discord.Collection
// Further down in client.on('message'...) it is used to redirect incoming input to the relative commands
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    client.help.set(command.name, command.usage);
}

// This Cron Job automates the commands/twitchclips.js command 
// Every day at midnight it searches for Twitch clips from a given channel and posts them
// to a specific channel automatically

// let scheduleClipCheck = new cron.CronJob('00 00 00 * * *', () => {
//     console.log('Checking for clips')
//     client.commands.get("twitchclipsauto").execute(client, "", []);
// });
// scheduleClipCheck.start()


// The following is a daily event check that pulls events from a given Google Calendar
// The config file should have a Google Calendar API ID, Secret, and Refresh Token (I use OAuth 2.0 Playground)
// Also need to have the Google Calendar ID itself to indicate which calendar to pull from
// More details on OAuth 2.0 Playground found here: https://stackoverflow.com/questions/19766912/how-do-i-authorise-an-app-web-or-installed-without-user-intervention/19766913#19766913
// For details on GoogleAPI Calendar see https://www.npmjs.com/package/googleapis
// In the Google API Project Console make sure that the project is published (does not need verification) to prevent Refresh Tokens from expiring after 1 week. (Testing)

async function getTodaysEvents(startDate, endDate) {
    const res = await calendar.events.list({
        calendarId: botconfig.CALENDAR_ID,
        timeMin: startDate,
        timeMax: endDate
    })
    // console.log(res.data)
    return res.data.items;
}

async function testingEventCheck() {
    console.log("Checking for events to announce today")

    const currDay = new Date();
    const currDayMS = currDay.getTime();
    const timezoneOffset = currDay.getTimezoneOffset() * 60 * 1000; // Get offset in ms
    const isDaylight = timezoneOffset == '420'

    const startDate = new Date(currDayMS - timezoneOffset); // Get current day in local time
    const startDateFormatted = startDate.toISOString().substring(0, startDate.toISOString().length - 5) + ((isDaylight) ? '-07:00' : '-08:00') // Format friendly for Google Calendar API
    const endDate = new Date(currDayMS - timezoneOffset);
    endDate.setUTCHours(22, 59, 59)
    const endDateFormatted = endDate.toISOString().substring(0, endDate.toISOString().length - 5) + ((isDaylight) ? '-07:00' : '-08:00')

    let events = await getTodaysEvents(startDateFormatted, endDateFormatted);

    if (!events.length) return; // No events today, skip announcements

    const targetChannel = client.channels.cache.get("701976025357090816") // Channel for announcements (Where to send embeds for events)

    // targetChannel.send(startDateFormatted)
    // targetChannel.send(endDateFormatted)

    for (var i = 0; i < events.length; i++) {
        // console.log(events[i])
        let title = events[i].summary;
        let startTime = (events[i].start.dateTime) ? new Date(events[i].start.dateTime).toLocaleTimeString() : '';
        let endTime = (events[i].end.dateTime) ? new Date(events[i].end.dateTime).toLocaleTimeString() : '';

        if (startTime != '') {
            startTime = startTime.substring(0, startTime.length - 6) + ' ' + startTime.substring(startTime.length - 2, startTime.length + 1) + ' - '
            endTime = endTime.substring(0, endTime.length - 6) + ' ' + endTime.substring(endTime.length - 2, endTime.length + 1)
        }

        let desc = (events[i].description) ? events[i].description : '';
        let embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setDescription(`${startTime}${endTime} \n ${desc}`)
            .setColor('BLUE')
            .setFooter('Google Calendar')
            .setTimestamp()
        targetChannel.send({
            embeds: [embed]
        })
    }
}

// setTimeout(testingEventCheck, 3000)
// testingEventCheck()

let eventCheck = new cron.CronJob('00 00 00 * * *', async () => {
    console.log("Checking for events to announce today")

    const currDay = new Date();
    const currDayMS = currDay.getTime();
    const timezoneOffset = currDay.getTimezoneOffset() * 60 * 1000; // Get offset in ms
    const isDaylight = timezoneOffset == '420'

    const startDate = new Date(currDayMS - timezoneOffset); // Get current day in local time
    const startDateFormatted = startDate.toISOString().substring(0, startDate.toISOString().length - 5) + ((isDaylight) ? '-07:00' : '-08:00') // Format friendly for Google Calendar API
    const endDate = new Date(currDayMS - timezoneOffset);
    endDate.setUTCHours(22, 59, 59)
    const endDateFormatted = endDate.toISOString().substring(0, endDate.toISOString().length - 5) + ((isDaylight) ? '-07:00' : '-08:00')

    let events = await getTodaysEvents(startDateFormatted, endDateFormatted);

    if (!events.length) return; // No events today, skip announcements

    const targetChannel = client.channels.cache.get("902068387692281947") // Channel for announcements (Where to send embeds for events)

    for (var i = 0; i < events.length; i++) {
        // console.log(events[i])
        let title = events[i].summary;
        let startTime = (events[i].start.dateTime) ? new Date(events[i].start.dateTime).toLocaleTimeString() : '';
        let endTime = (events[i].end.dateTime) ? new Date(events[i].end.dateTime).toLocaleTimeString() : '';

        if (startTime != '') {
            startTime = startTime.substring(0, startTime.length - 6) + ' ' + startTime.substring(startTime.length - 2, startTime.length + 1) + ' - '
            endTime = endTime.substring(0, endTime.length - 6) + ' ' + endTime.substring(endTime.length - 2, endTime.length + 1)
        }

        let desc = (events[i].description) ? events[i].description : '';
        let embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setDescription(`${startTime}${endTime} \n ${desc}`)
            .setColor('BLUE')
            .setFooter('Google Calendar')
            .setTimestamp()
        targetChannel.send({
            embeds: [embed]
        })
    }

})
eventCheck.start();

// See example & docs here: https://distube.js.org/guide/example-bot.html 
client.distube = new distube(client, {
    searchSongs: false,
    emitNewSongOnly: true,
    leaveOnFinish: true,
    leaveOnEmpty: true
})
client.distube
    .on('playSong', (queue, song) =>
        queue.channel.send(
            `Playing \`${song.songs[0].name}\` - \`${
				song.songs[0].formattedDuration
			}\`\nRequested by: ${song.songs[0].user}\n`,
        ))
    .on('addSong', (queue, song) =>
        queue.channel.send(
            `${song.songs[song.songs.length - 1].user} added \`${song.songs[song.songs.length - 1].name}\` - \`${song.songs[song.songs.length - 1].formattedDuration}\` to the queue.`,
        ))
    .on('error', (queue, e) => {
        console.error(e)
    })

client.on('ready', async () => {
    console.log(`${client.user.username} is online`)

    new WOKCommands(client, { //WOKCommands to implement slash commands. See https://docs.wornoffkeys.com/commands/slash-commands 
        commandsDir: 'slashcommands',
        testServers: [guildID], // guildID allows for quicker slash command testing as global slash commands take about an hour to update
        showWarns: false,
    })
    const commandsGuild = await client.api.applications(client.user.id).guilds(botconfig.GUILD_ID).commands.get();
    console.log(commandsGuild)
    const commands = await client.api.applications(client.user.id).commands.get();
    // console.log(commands)
    var cmdList = []
    for (const command of commands) {
        cmdList.push(`/${command.name}`)
    }
    client.slashcommands = cmdList.join(' \n')

    console.log('We good to go!')

    // Also note that in order for slash commands to work client must be given applications.commands scope
    // See https://discord.com/developers/docs/interactions/slash-commands for more info
})

client.on('threadCreate', async thread => {
    console.log(thread)
    thread.join()
})

// client.on('interactionCreate', async (interaction) => {
//     if (interaction.isButton()) {
//         interaction.reply({
//             content: `${interaction.user.tag} clicked button`
//         })
//     }
// })

client.on('message', async message => {
    if (message.author.bot || message.channel.type === 'dm') return; //ignore DMs and bot messages

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(' ');
    let hasPrefix = messageArray[0][0] === prefix;


    // When F phrases are detected bot will auto send "F" in response (Cooldown of 15s)
    let f_arr = ["f in the chat", "f in chat"]
    if (message.content.toLowerCase() == "f" || f_arr.some(f => message.content.toLowerCase().includes(f))) {
        if (db.get("F_cooldown") && Date.now() - db.get("F_cooldown") < 15000) return
        db.set("F_cooldown", Date.now())
        message.channel.send("F")
    }

    // When GG phrases are detected bot will auto send "GG" in response (Cooldown of 15s)
    let gg_arr = ["gg in the chat", "gg in chat"]
    if (message.content.toLowerCase() == "gg" || gg_arr.some(gg => message.content.toLowerCase().includes(gg))) {
        if (db.get("gg_cooldown") && Date.now() - db.get("gg_cooldown") < 15000) return
        db.set("gg_cooldown", Date.now())
        message.channel.send("gg")
    }

    // Logic for channel message streaks
    // If a specific message in a certain channel is repeated at least 3 times it becomes a streak
    // The 'lastmsg' and 'msgcount' are nested Maps within a larger client.counter Map
    // Each channel is given a Map to account for streaks using their channel id
    if (!client.counter.get(message.channel.id)) {
        let obj = new Map();
        obj.set('lastmsg', message.content.toLowerCase());
        obj.set('msgcount', 0);
        client.counter.set(message.channel.id, obj);
    } else {
        let msgCount = client.counter.get(message.channel.id).get('msgcount');
        let msgDuped = client.counter.get(message.channel.id).get('lastmsg');
        if (message.content.toLowerCase() == msgDuped.toLowerCase()) {
            client.counter.get(message.channel.id).set('msgcount', msgCount + 1);
        } else if (msgCount >= 2) {
            client.counter.get(message.channel.id).set('lastmsg', message.content);
            client.counter.get(message.channel.id).set('msgcount', 0);
            message.channel.send(`**${msgCount + 1}X Streak** for message: "${msgDuped}" broken by <@${message.author.id}>`);
        } else {
            client.counter.get(message.channel.id).set('lastmsg', message.content);
            client.counter.get(message.channel.id).set('msgcount', 0);
        }
    }

    const wds = ['a', 'an']; // words to check for after "wtf is" to redirect to google command
    if (messageArray.indexOf("wtf") > -1 && messageArray.length - messageArray.indexOf("wtf") > 2) {
        if (messageArray[messageArray.indexOf("wtf") + 1] == 'is' && wds.includes(messageArray[messageArray.indexOf("wtf") + 2])) {
            let query = messageArray.slice(messageArray.indexOf("wtf") + 3);
            client.commands.get("google").execute(client, message, query);
            return
        }
    }

    if (!hasPrefix) return; //ignore if message does not start with prefix

    // some general parsing, splitting the command from its arguments
    let cmd = messageArray[0].toLowerCase().slice(1);
    let args = messageArray.slice(1);
    args = args.filter(function (el) {
        return el != '';
    })

    switch (cmd) { //handler for command aliases
        case 'tr':
            cmd = 'translate';
            break;

        case 'def':
            cmd = 'define';
            break;

        case 'cmm':
            cmd = 'changemymind'
            break;

        case 'rt':
            cmd = 'rottentomato'
            break;

        case 'tomato':
            cmd = 'rottentomato'
            break;

        case 'stop':
            cmd = 'leave'
            break;

        case 'coin':
            cmd = 'flip'
            break;

        case 'coinflip':
            cmd = 'flip'
            break;

        case 'flipcoin':
            cmd = 'flip'
            break;

        default:
            break;
    }

    // If the command exists in ./commands/ then execute
    // else just ignore
    if (!client.commands.has(cmd)) return;
    try {
        client.commands.get(cmd).execute(client, message, args);
    } catch (e) {
        console.log(e);
    }

})

// Logic for logging message edits and populating a Map tied to message id 
// Map holds message id as key and stores an embed as value
// Messages that have been edited multiple times have multiple embeds meant for pagination
// See commands/log.js for details on how embeds are processed and outputted
client.on('messageUpdate', (oldMessage, newMessage) => {
    if (oldMessage.author.bot || oldMessage.channel.type === 'dm') return;

    logChannel = client.channels.cache.get("701976025357090816")
    messageHistory = client.logs.get(oldMessage.id);

    let embed = new Discord.MessageEmbed()
        .setDescription(`From <@${oldMessage.author.id}> \n [Source](${oldMessage.url})`)
        .addField("Old Message:", oldMessage.content)
        .addField("New Message:", newMessage.content)
        .setColor("RED")
        .setTimestamp()

    if (!messageHistory) messageHistory = [];

    embed.setTitle(`Logged Edit #${messageHistory.length + 1}`)
    messageHistory.push(embed)
    let id = oldMessage.id
    client.logs.set(id, messageHistory)
    //logChannel.send(embed)
    //console.log(client.logs)

})

// Helpers for manual Interaction processing and posting
// Used for slash commands when WOKCommand flow isn't suitable
// Basic usage: client.reply(interaction, content) where content is a string, embed, etc
// Credit: https://github.com/AlexzanderFlores/Worn-Off-Keys-Discord-Js/blob/master/82-Slash-Commands/index.js
client.reply = async (interaction, response) => {
    let data = {
        content: response,
    }

    // Check for embeds
    if (typeof response === 'object') {
        data = await client.createAPIMessage(interaction, response)
    }

    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data,
        },
    })
}

client.createAPIMessage = async (interaction, content) => {
    const {
        data,
        files
    } = await Discord.APIMessage.create(
            client.channels.resolve(interaction.channel_id),
            content
        )
        .resolveData()
        .resolveFiles()

    return {
        ...data,
        files
    }
}

client.login(botconfig.token);