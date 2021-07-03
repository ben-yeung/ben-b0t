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

require("./util/eventHandler")(client)

let guildID = botconfig.GUILD_ID

const fs = require('fs');
client.commands = new Discord.Collection();

client.reminders = new Map();
client.mute = new Map();
client.logs = new Map();
client.counter = new Map();
client.help = new Map();


const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    client.help.set(command.name, command.usage);
}

let scheduleClipCheck = new cron.CronJob('00 00 00 * * *', () => {
    console.log('Checking for clips')
    client.commands.get("twitchclipsauto").execute(client, "", []);
});
scheduleClipCheck.start()

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

    if (!client.counter.get(message.channel.id)) { //logic for getting message streaks
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

    if (!hasPrefix) return; //ignore if message does not start with prefix

    let cmd = messageArray[0].toLowerCase().slice(1);
    let args = messageArray.slice(1);
    args = args.filter(function (el) {
        return el != '';
    })

    switch (cmd) { //handler for command shortcuts
        case 'tr':
            cmd = 'translate';
            break;

        case 'def':
            cmd = 'define';
            break;

        case 'cmm':
            cmd = 'changemymind'
            break;

        default:
            break;
    }

    if (!client.commands.has(cmd)) return;
    try {
        client.commands.get(cmd).execute(client, message, args);
    } catch (e) {
        console.log(e);
    }

})


client.on('messageUpdate', (oldMessage, newMessage) => { //logic for log command
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
    console.log(client.logs)

})

client.login(botconfig.token);