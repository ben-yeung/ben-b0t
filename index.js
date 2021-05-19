const Discord = require('discord.js');
const {
    MessageAttachment
} = require('discord.js');
const botconfig = require('./botconfig.json');
const cron = require("cron");
const bot = new Discord.Client({
    disableEveryone: true
});
require("./util/eventHandler")(bot)


const fs = require('fs');
bot.commands = new Discord.Collection();

bot.reminders = new Map();
bot.mute = new Map();
bot.logs = new Map();
bot.counter = new Map();
bot.help = new Map();


const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
    bot.help.set(command.name, command.usage);
}

let scheduleClipCheck = new cron.CronJob('0 0 */1 * * *', () => {
    bot.commands.get("twitchclips").execute(bot, "", []);
});
scheduleClipCheck.start()

bot.on('message', async message => {
    if (message.author.bot || message.channel.type === 'dm') return; //ignore DMs and bot messages


    let prefix = botconfig.prefix;
    let messageArray = message.content.split(' ');
    let hasPrefix = messageArray[0][0] === prefix;

    if (!bot.counter.get(message.channel.id)) { //logic for getting message streaks
        let obj = new Map();
        obj.set('lastmsg', message.content.toLowerCase());
        obj.set('msgcount', 0);
        bot.counter.set(message.channel.id, obj);
    } else {
        let msgCount = bot.counter.get(message.channel.id).get('msgcount');
        let msgDuped = bot.counter.get(message.channel.id).get('lastmsg');
        if (message.content.toLowerCase() == msgDuped.toLowerCase()) {
            bot.counter.get(message.channel.id).set('msgcount', msgCount + 1);
        } else if (msgCount >= 2) {
            bot.counter.get(message.channel.id).set('lastmsg', message.content);
            bot.counter.get(message.channel.id).set('msgcount', 0);
            message.channel.send(`**${msgCount + 1}X Streak** for message: "${msgDuped}" broken by <@${message.author.id}>`);
        } else {
            bot.counter.get(message.channel.id).set('lastmsg', message.content);
            bot.counter.get(message.channel.id).set('msgcount', 0);
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

    if (!bot.commands.has(cmd)) return;
    try {
        bot.commands.get(cmd).execute(bot, message, args);
    } catch (e) {
        console.log(e);
    }

})


bot.on('messageUpdate', (oldMessage, newMessage) => { //logic for log command
    if (oldMessage.author.bot || oldMessage.channel.type === 'dm') return;

    logChannel = bot.channels.cache.get("701976025357090816")
    messageHistory = bot.logs.get(oldMessage.id);

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
    bot.logs.set(id, messageHistory)
    //logChannel.send(embed)
    console.log(bot.logs)

})

bot.login(botconfig.token);