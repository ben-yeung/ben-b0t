const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { ButtonBuilder, ActionRowBuilder } = require("discord.js");
const Discord = require("discord.js");
const botconfig = require("./botconfig.json");
const token = botconfig.TOKEN; // Discord Bot Token
const { initializeCommands } = require("./deploy");
const { OpenAI } = require("openai");

const client = new Discord.Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.MessageContent],
});

const cron = require("cron");
const db = require("quick.db");
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp");

const { google } = require("googleapis");
const { OAuth2 } = google.auth;

const openai = new OpenAI({
  apiKey: botconfig.OPENAI_KEY,
});
client.openai = openai;

const oAuth2Client = new OAuth2(botconfig.G_CALENDAR_CLIENT_ID, botconfig.G_CALENDAR_CLIENT_SECRET);
oAuth2Client.setCredentials({
  refresh_token: botconfig.G_REFRESH_TOKEN,
});

const calendar = google.calendar({
  version: "v3",
  auth: oAuth2Client,
});

async function getTodaysEvents(startDate, endDate) {
  const res = await calendar.events.list({
    calendarId: botconfig.CALENDAR_ID,
    timeMin: startDate,
    timeMax: endDate,
  });
  // console.log(res.data)
  return res.data.items;
}

async function checkCalendar() {
  const currDay = new Date();
  const currDayMS = currDay.getTime();
  const timezoneOffset = currDay.getTimezoneOffset() * 60 * 1000; // Get offset in ms
  const isDaylight = timezoneOffset == "420";

  const startDate = new Date(currDayMS - timezoneOffset); // Get current day in local time
  const startDateFormatted = startDate.toISOString().substring(0, startDate.toISOString().length - 5) + (isDaylight ? "-07:00" : "-08:00"); // Format friendly for Google Calendar API
  const endDate = new Date(currDayMS - timezoneOffset);
  endDate.setUTCHours(22, 59, 59);
  const endDateFormatted = endDate.toISOString().substring(0, endDate.toISOString().length - 5) + (isDaylight ? "-07:00" : "-08:00");

  let events = await getTodaysEvents(startDateFormatted, endDateFormatted);

  if (!events.length) return console.log("No events found :("); // No events today, skip announcements

  const targetChannel = client.channels.cache.get("902068387692281947"); // Channel for announcements (Where to send embeds for events)
  if (targetChannel == undefined) {
    return console.log("Channel for announcements not found");
  }

  for (var i = 0; i < events.length; i++) {
    // console.log(events[i])
    let title = events[i].summary;
    let startTime = events[i].start.dateTime ? new Date(events[i].start.dateTime).toLocaleTimeString() : "";
    let endTime = events[i].end.dateTime ? new Date(events[i].end.dateTime).toLocaleTimeString() : "";

    if (startTime != "") {
      startTime = startTime.substring(0, startTime.length - 6) + " " + startTime.substring(startTime.length - 2, startTime.length + 1) + " - ";
      endTime = endTime.substring(0, endTime.length - 6) + " " + endTime.substring(endTime.length - 2, endTime.length + 1);
    }

    let desc = events[i].description ? events[i].description : "";
    let embed = new Discord.EmbedBuilder()
      .setTitle(title)
      .setDescription(`${startTime}${endTime} \n ${desc}`)
      .setColor(Math.floor(Math.random() * 16777214) + 1)
      .setFooter({ text: "Google Calendar" })
      .setTimestamp();
    targetChannel.send({
      embeds: [embed],
    });
  }
}

let eventCheck = new cron.CronJob(
  "00 00 00 * * *",
  async () => {
    console.log("Checking for events to announce today");
    checkCalendar();
  },
  undefined,
  true,
  "America/Los_Angeles"
);
eventCheck.start();
// checkCalendar();

// See example & docs here: https://distube.js.org/guide/example-bot.html
client.distube = new DisTube(client, {
  leaveOnStop: false,
  leaveOnEmpty: true,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin({
      emitEventsAfterFetching: true,
    }),
    new SoundCloudPlugin(),
    new YtDlpPlugin(),
  ],
});

let ytThumb = "https://www.pngmart.com/files/20/Youtube-Logo-Transparent-PNG.png";

client.distube
  .on("playSong", (queue, song) => {
    const sourceBtn = new ButtonBuilder().setLabel("Source").setURL(song.url).setStyle("Link");

    const row = new ActionRowBuilder().addComponents(sourceBtn);

    let embed = new Discord.EmbedBuilder().setTitle(`Now Playing \`${song.name}\``).setDescription(`Duration: \`${song.formattedDuration}\` \n Requested by: <@${song.member.id}>`).setImage(song.thumbnail).setThumbnail(ytThumb).setColor("Red").setTimestamp();

    queue.textChannel.send({ components: [row], embeds: [embed] });
  })

  .on("addSong", (queue, song) => {
    const sourceBtn = new ButtonBuilder().setLabel("Source").setURL(song.url).setStyle("Link");

    const row = new ActionRowBuilder().addComponents(sourceBtn);

    let embed = new Discord.EmbedBuilder().setTitle(`Added \`${song.name}\` to the queue`).setDescription(`Duration: \`${song.formattedDuration}\` \n Requested by: <@${song.member.id}>`).setImage(song.thumbnail).setThumbnail(ytThumb).setColor("Red").setTimestamp();

    queue.textChannel.send({ components: [row], embeds: [embed] });
  })

  .on("error", (queue, e) => {
    console.error(e);
  });

client.on("threadCreate", async (thread) => {
  console.log(thread);
  thread.join();
});

client.reminders = new Map(); // commands/remind.js command
client.mute = new Map(); // commands/mute.js and commands/unmute.js commands
client.logs = new Map(); // commands/log.js command
client.counter = new Map(); // Keeping track of message streaks in client.on('message'...)
client.help = new Map(); // commands/help.js command
client.responses = new Map(); // commands/menu.js command
client.summaries = new Map(); // Tracks /summarize command interactions to listen for replies with followups

client.commands = new Collection();

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  if (command.permission) {
    const user = interaction.member;
    const userPerms = interaction.channel.permissionsFor(user);
    if (!userPerms || !userPerms.has(command.permission)) return interaction.reply("You do not have the permissions to use this command :(");
  }

  try {
    await command.execute(interaction, [], client);
  } catch (error) {
    console.error(error);
  }
});

client.on("ready", async () => {
  await initializeCommands(client);
  client.LOOP = false;

  client.user.setActivity("for /help", {
    type: "WATCHING",
  });

  console.log(`${client.user.username} is online!`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return; //ignore DMs and bot messages
  if (message.channel.type === "dm") return message.reply("Sorry I don't do direct messages. Too personal for me.");

  // Logic for handling follow questions to the /summarize interaction
  if (message.type == 19) {
    let refId = message.reference.messageId;
    if (refId && db.get(refId)) {
      const typingInterval = setInterval(() => {
        message.channel.sendTyping();
      }, 5000);

      var conversation = db.get(refId);
      let author = message.author;

      conversation.push({
        role: "user",
        name: author.globalName.replaceAll(" ", "_") ? author.globalName.replaceAll(" ", "_") : author.username,
        content: message.content,
      });

      const gptResponse = await client.openai.chat.completions
        .create({
          model: "gpt-4",
          messages: conversation,
        })
        .catch((err) => {
          console.log(err);
        });
      clearInterval(typingInterval);

      if (!gptResponse) {
        message.reply("An error occurred or was rate limited.");
        return;
      }

      let botReply = await message.reply({ content: gptResponse.choices[0].message.content.replaceAll("_", " "), fetchReply: true });

      conversation.push({
        role: "system",
        content: gptResponse.choices[0].message.content,
      });

      db.set(botReply.id, conversation);
    }
  }

  // let prefix = botconfig.prefix;
  // let messageArray = message.content.split(" ");
  // let hasPrefix = messageArray[0][0] === prefix;

  // When F phrases are detected bot will auto send "F" in response (Cooldown of 15s)
  let f_arr = ["f in the chat", "f in chat"];
  if (message.content.toLowerCase() == "f" || f_arr.some((f) => message.content.toLowerCase().includes(f))) {
    if (db.get("F_cooldown") && Date.now() - db.get("F_cooldown") < 15000) return;
    db.set("F_cooldown", Date.now());
    message.channel.send("F");
  }

  // When GG phrases are detected bot will auto send "GG" in response (Cooldown of 15s)
  let gg_arr = ["gg in the chat", "gg in chat"];
  if (message.content.toLowerCase() == "gg" || gg_arr.some((gg) => message.content.toLowerCase().includes(gg))) {
    if (db.get("gg_cooldown") && Date.now() - db.get("gg_cooldown") < 15000) return;
    db.set("gg_cooldown", Date.now());
    message.channel.send("gg");
  }

  // Logic for channel message streaks
  // If a specific message in a certain channel is repeated at least 3 times it becomes a streak
  // The 'lastmsg' and 'msgcount' are nested Maps within a larger client.counter Map
  // Each channel is given a Map to account for streaks using their channel id
  if (message.content != "") {
    if (!client.counter.get(message.channel.id)) {
      let obj = new Map();
      obj.set("lastmsg", message.content.toLowerCase());
      obj.set("msgcount", 0);
      client.counter.set(message.channel.id, obj);
    } else {
      let msgCount = client.counter.get(message.channel.id).get("msgcount");
      let msgDuped = client.counter.get(message.channel.id).get("lastmsg");
      if (message.content.toLowerCase() == msgDuped.toLowerCase()) {
        client.counter.get(message.channel.id).set("msgcount", msgCount + 1);
      } else if (msgCount >= 2) {
        client.counter.get(message.channel.id).set("lastmsg", message.content);
        client.counter.get(message.channel.id).set("msgcount", 0);
        message.channel.send(`**${msgCount + 1}X Streak** for message: "${msgDuped}" broken by <@${message.author.id}>`);
      } else {
        client.counter.get(message.channel.id).set("lastmsg", message.content);
        client.counter.get(message.channel.id).set("msgcount", 0);
      }
    }
  }
});

// Logic for logging message edits and populating a Map tied to message id
// Map holds message id as key and stores an embed as value
// Messages that have been edited multiple times have multiple embeds meant for pagination
// See commands/log.js for details on how embeds are processed and outputted
// client.on("messageUpdate", (oldMessage, newMessage) => {
//   if (oldMessage.author.bot || oldMessage.channel.type === "dm") return;

//   messageHistory = client.logs.get(oldMessage.id);

//   let embed = new Discord.EmbedBuilder()
//     .setDescription(`From <@${oldMessage.author.id}> \n [Source](${oldMessage.url})`)
//     .addFields([
//       { name: "Old:", value: oldMessage.content },
//       { name: "New:", value: newMessage.content },
//     ])
//     .setColor("Red")
//     .setTimestamp();

//   if (!messageHistory) messageHistory = [];

//   embed.setTitle(`Logged Edit #${messageHistory.length + 1}`);
//   messageHistory.push(embed);
//   let id = oldMessage.id;
//   client.logs.set(id, messageHistory);
// });

client.on("guildCreate", async (guild) => {
  console.log(`Bot added to guild ${guild.name}.`);
});

client.on("guildDelete", async (guild) => {
  console.log(`Bot removed from guild ${guild.name}.`);
});

client.login(token);
