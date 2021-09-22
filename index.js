const Discord = require('discord.js');
const {
    MessageAttachment
} = require('discord.js');
const botconfig = require('./botconfig.json');
const cron = require("cron");
const client = new Discord.Client({
    disableEveryone: true
});
const WOKCommands = require('wokcommands') // Used to implement slash command handler
require('discord-buttons')(client)
require("./util/eventHandler")(client)

const distube = require('distube')

let guildID = botconfig.GUILD_ID

const fs = require('fs');
const cardFolder = './media/cards/'

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

// See example & docs here: https://distube.js.org/guide/example-bot.html 
client.distube = new distube(client, {
    searchSongs: false,
    emitNewSongOnly: true,
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
            `Added \`${song.songs[song.songs.length - 1].name} - \`${song.songs[song.songs.length - 1].formattedDuration}\` to the queue by ${song.songs[song.songs.length - 1].user}`,
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


client.on('message', async message => {
    if (message.author.bot || message.channel.type === 'dm') return; //ignore DMs and bot messages

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(' ');
    let hasPrefix = messageArray[0][0] === prefix;

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