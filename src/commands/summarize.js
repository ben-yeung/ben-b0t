const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const botconfig = require("../botconfig.json");
const colors = require("../colors.json");
const db = require("quick.db");
const ms = require("ms");

async function parseMessages(msgObj) {
  res = [];

  msgObj
    .filter((msg) => msg.author && !msg.author.bot && msg.content && Date.now() - msg.createdTimestamp <= 8.64e7)
    .map((msg) => {
      let author = msg.author;
      let content = msg.content;
      let user = author.globalName ? author.globalName : author.username;
      res.push({
        role: "user",
        name: user.replaceAll(" ", "_"),
        content: content,
      });
    });

  return res.reverse();
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("summarize")
    .setDescription("Create a small summary based on the previous messages in the channel it was called in.")
    .addStringOption((option) => option.setName("question").setDescription("What would you like to ask in addition to the summary?").setRequired(false)),
  options: "(optional additional question)",
  async execute(interaction, args, client) {
    let channel_id = interaction.channel.id;
    if (db.get(`${channel_id}.summarizeStarted`) && Date.now() - db.get(`${channel_id}.summarizeStarted`) <= 30000) {
      return interaction.reply({
        content: `Please wait ${ms(30000 - (Date.now() - db.get(`${channel_id}.summarizeStarted`)))} before starting another query!`,
        ephemeral: true,
      });
    } else {
      db.set(`${channel_id}.summarizeStarted`, Date.now());
    }

    let responses = ["Checking the logs ...", "Pulling info from the NSA ...", "Reading the README.md ...", "Running logs through sanity checker ...", "Reading the terms of service ...", "Inspecting the fine print ..."];
    let choice = responses[Math.floor(Math.random() * responses.length)];
    let question = interaction.options.getString("question");
    await interaction.reply(`${choice} <a:working:821570743329882172>`);

    await interaction.channel.messages
      .fetch({
        limit: 100,
      })
      .then(async (messages) => {
        let parsed = await parseMessages(messages);
        if (!parsed || parsed.length == 0) {
          return interaction.editReply("Something went wrong...");
        }
        let prompt = `Create a concise summary of the following messages in the order they appear. 
                      Keep the summary under 2000 characters keeping it relevant and concise where possible. 
                      The summary should have topic headers relevant to the message and bullet points for context details of the conversation. 
                      Surround important or impactful statements with bold markdown. 
                      Do not mention "User" and instead always use their name. 
                      Headers are only for message topics and should not include "Topic:" 
                      The number of topics should be as minimized as possible for clarity. `;
        if (question) {
          prompt += " With an answer to the following question within the scope of the messages: " + question;
        }

        const response = await client.openai.chat.completions
          .create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: prompt,
              },
              ...parsed,
            ],
          })
          .catch((err) => {
            console.log(err);
            return interaction.editReply("Something went wrong or was rate limited...");
          });

        if (!response || !response.choices) {
          return interaction.editReply("Something went wrong or was rate limited...");
        }
        let replyMessage = await interaction.editReply({ content: `${response.choices[0].message.content.replaceAll("_", " ")}`, fetchReply: true });

        db.set(`${replyMessage.id}`, [
          {
            role: "system",
            content: `You just summarized the messages formatted as Username:Message below and any assistant roled messages are follow up questions/comments that you must answer in a concise message.
                      Respond to questions, specifying usernames if necessary to give context for messages, and keep the response under 2000 characters.
                      `,
          },
          ...parsed,
        ]);

        return;
      })
      .catch((err) => {
        console.log(err);
        return interaction.editReply("Something went wrong or was rate limited...");
      });
  },
};
