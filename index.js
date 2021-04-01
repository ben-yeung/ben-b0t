const Discord = require('discord.js');
const {
    MessageAttachment
} = require('discord.js');
const botconfig = require('./botconfig.json');
const bot = new Discord.Client({
    disableEveryone: true
});
require("./util/eventHandler")(bot)


const fs = require('fs');
bot.commands = new Discord.Collection();

bot.reminders = new Map();
bot.mute = new Map();
bot.logs = new Map();


const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}

bot.on('message', async message => {
    if (message.author.bot || message.channel.type === 'dm') return;

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(' ');
    let hasPrefix = messageArray[0][0] === prefix;

    if (!hasPrefix) return;

    let cmd = messageArray[0].toLowerCase().slice(1);
    let args = messageArray.slice(1);
    args = args.filter(function (el) {
        return el != '';
    })

    switch (cmd) {
        case 'tr':
            cmd = 'translate';
            break;

        case 'def':
            cmd = 'define';
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


bot.on('messageUpdate', (oldMessage, newMessage) => {
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
    let url = oldMessage.url.replace("discordapp", "discord")
    bot.logs.set(url, messageHistory)
    //logChannel.send(embed)
    console.log(bot.logs)

})

bot.login(botconfig.token);